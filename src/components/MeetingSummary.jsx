import React, { useState, useEffect } from "react";
import Dynamics365Entity from "./Dynamics365Entity";

const MeetingSummary = ({ chatid,selectedEmployeeID }) => {
  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const encodeddata = encodeURIComponent(chatid);
        const modifiedEncodedData = encodeddata.replace(/%3A/g, "%3a");

        const response = await fetch(
          "https://prod-15.centralindia.logic.azure.com:443/workflows/fd3f528c9f88433b977e6960e0dc8598/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Xxg59PfxEETyPe1QjihDrmTdTmHXhhfV70oyTlPch1c",
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
            className="heading"
            style={{ marginLeft: "350px", marginTop: "20px", width: "520px" }}
          >
            This is Schedule to discuss for following item.
          </h6>
          <div
            style={{ marginLeft: "350px", marginTop: "20px", width: "520px" }}
          >
             {employees !== null ? (
          employees.length > 0 ? (
            <table className="table table-bordered table-striped">
              <tbody>
                <tr style={{ border: "1px solid lightgray" }}>
                  {Object.keys(employees[0]).map((property) => (
                    <th scope="col" key={property}>
                      {property}
                    </th>
                  ))}
                </tr>
                {employees.map((employee) => (
                  <tr
                    key={employee.EmployeeID}
                    style={{
                      backgroundColor:
                        employee.EmployeeID === selectedEmployeeID
                          ? "yellow" // Highlight color
                          : "transparent",
                    }}
                  >
                    {Object.values(employee).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No employees data available</p>
          )
        ) : (
          <div class="spinner-border text-primary spinner" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
        </>
      ) : (
        <div class="spinner-border text-primary spinner" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default MeetingSummary;
