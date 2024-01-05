import React, { useState, useEffect } from "react";
import AddEmployee from "./AddEmployee";
import Dynamics365Entity from "./Dynamics365Entity";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const MeetingSummary = ({ chatid }) => {
  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const encodeddata = encodeURIComponent(chatid);
        const modifiedEncodedData = encodeddata.replace(/%3A/g, "%3a");

        const response = await fetch(
          "https://prod-03.centralindia.logic.azure.com:443/workflows/d3ee0df170f442c28f9d0aad00decdaf/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TUxwXjMdAxOzXQKSNCBM80V4S4qEL9Mu7BlDKgBwe00",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chatid: modifiedEncodedData,
            }),
          }
        );

        if (!response.ok) {
          setError("This meeting is not compatible for this App !!!");
          throw new Error("This meeting is not compatible for this App !!!");
        }

        const data = await response.json();

        if (isMounted) {
          setEmployees(data);
          setError(null);
        }

        console.log("the meeting details", data.value);
      } catch (error) {
        if (isMounted) {
          setError("Error fetching meeting details");
        }
        console.error("Error fetching meeting details", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function to cancel any pending operations
      isMounted = false;
    };
  }, [chatid]);
  return (
    <div className="App" style={{ marginTop: "-55px", marginRight: "60px" }}>
      {error ? (
        <p style={{ marginLeft: "80px", color: "red", fontSize: "16px" }}>
          {error}
        </p>
      ) : employees ? (
        <>
          <Dynamics365Entity />
          <h6
            style={{ marginLeft: "350px", marginTop: "20px", width: "520px" }}
          >
            This is Schedule to discuss for following item.
          </h6>
          <div
            style={{ marginLeft: "350px", marginTop: "20px", width: "520px" }}
          >
            <table className="table table-bordered table-striped">
              <tbody>
                <tr style={{ border: "1px solid lightgray" }}>
                  <th scope="col">Employee ID</th>
                  {employees.map((employee) => (
                    <td key={employee.EmployeeID}>{employee.EmployeeID}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="col">First Name</th>
                  {employees.map((employee) => (
                    <td key={employee.EmployeeID}>{employee.FirstName}</td>
                  ))}
                </tr>
                <tr style={{ border: "1px solid lightgray" }}>
                  <th scope="col">Last Name</th>
                  {employees.map((employee) => (
                    <td key={employee.EmployeeID}>{employee.LastName}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // <p style={{ marginLeft: "80px", color: "black", fontSize: "16px" }}>
        //   Loading...
        // </p>
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default MeetingSummary;
