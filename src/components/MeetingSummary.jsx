import React, { useState, useEffect } from "react";
import AddEmployee from "./AddEmployee";
import Dynamics365Entity from "./Dynamics365Entity";

const MeetingSummary = ({chatid}) => {
  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState(true);

  useEffect(() => {
    
    
    fetch("https://prod-03.centralindia.logic.azure.com:443/workflows/d3ee0df170f442c28f9d0aad00decdaf/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TUxwXjMdAxOzXQKSNCBM80V4S4qEL9Mu7BlDKgBwe00", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       chatid: "19%3ameeting_MmUyNTVmMGEtNWQxZi00MjhiLWEwYzctMGI4NGEyZjE5OTY3%40thread.v2"
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
      console.log(data);
      setEmployees(data);
      setError(null);
      console.log("the meeting details", data.value);
    })
    .catch((error) => {
      setError("Error fetching meeting details");
      console.error("Error fetching meeting details", error);
    });
}, [chatid]);

  return (
    <div className="App" style={{ marginTop: "-55px", marginRight: "60px" }}>
      {error ? (
        <p style={{ marginLeft: "80px", color: "red", fontSize: "16px" }}>
          {error}
        </p>
       ) : employees ? (
        <div >
          <Dynamics365Entity/>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.EmployeeID}>
                  <td>{employee.EmployeeID}</td>
                  <td>{employee.FirstName}</td>
                  <td>{employee.LastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ marginLeft: "80px", color: "black", fontSize: "16px" }}>
          Loading...
        </p>
      )}
    </div>
  );
};

export default MeetingSummary;
