import React, { useState, useEffect } from "react";
import AddEntity from "./AddEntity";
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

<<<<<<< HEAD
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
=======
  // console.log('meeting ID',)

  useEffect(() => {
    console.log(MeetingID, "chatId url")

    fetch("https://prod-19.centralindia.logic.azure.com:443/workflows/bd55225e5fd84e8d82664b4860200eff/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_pPuav4TDEfPJR9WIWihvjvWNrP4kpqKjHThpvT5-Fg", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatID: MeetingID
        // eventIdFromUrl,
        // "AAMkADBjMzUwZTk2LTNjZjQtNDg4OC05NGUzLWMzMjcwZGQzZDRlZgBGAAAAAABOL2KklS2zQ7eN7Yf7kB1dBwB6HKPOO2MUSrLAZ9rx2s0hAAAAAAENAAB6HKPOO2MUSrLAZ9rx2s0hAAEOj4QMAAA=",
      }),
    })
    .then((res) => {
      console.log(res, "Response-check-api");
      if (!res.ok) {
        console.log("invalid meeting id");
        setError("This meeting is not compatible for this App !!!");
        throw new Error("This meeting is not compatible for this App !!!");
      }
      return res.json();
    })
    .then((data) => {
      setMeetings(data);
      setError(null);
      console.log("the chat details", data);
      fetch("https://prod-27.centralindia.logic.azure.com:443/workflows/84d9c85cd2fd43509af9186e4d93133d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ubO2vmGZz2ZBkE6BDMHpOyr3aTI-CRmsktVAR9xV9bE", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingid: data.chatID
          // eventIdFromUrl,
          // meetingid:"AAMkADBjMzUwZTk2LTNjZjQtNDg4OC05NGUzLWMzMjcwZGQzZDRlZgBGAAAAAABOL2KklS2zQ7eN7Yf7kB1dBwB6HKPOO2MUSrLAZ9rx2s0hAAAAAAENAAB6HKPOO2MUSrLAZ9rx2s0hAAETNKUaAAA=",
        }),
      })
      .then((res) => {
        console.log(res, "Response-check-api");
        if (!res.ok) {
          setError("This meeting is not compatible for this App !!!");
          throw new Error("This meeting is not compatible for this App !!!");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setMeetings(data);
        setError(null);
        console.log("the meeting details", data.value);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error fetching meeting details", error);
      });
    })
    .catch((error) => {
      setError(error.message);
      console.error("Error fetching meeting details", error);
    });
}, [MeetingID]);
>>>>>>> 3e8b4a5de38cb613c744f04c2e0cea2383a0d42d

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
