import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import AddEmployee from "./AddEmployee";

const MeetingSummary = () => {
  const [meetings, setMeetings] = useState(null);
  const [error, setError] = useState(true);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigate("/meeting-summary");
  // }, []);

  useEffect(() => {
    fetch(
      "https://prod-27.centralindia.logic.azure.com:443/workflows/84d9c85cd2fd43509af9186e4d93133d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ubO2vmGZz2ZBkE6BDMHpOyr3aTI-CRmsktVAR9xV9bE",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingid:
            "AAMkADBjMzUwZTk2LTNjZjQtNDg4OC05NGUzLWMzMjcwZGQzZDRlZgBGAAAAAABOL2KklS2zQ7eN7Yf7kB1dBwB6HKPOO2MUSrLAZ9rx2s0hAAAAAAENAAB6HKPOO2MUSrLAZ9rx2s0hAAEGhxJZAAA=",
        }),
      }
    )
      .then((res) => {
        console.log(res, "Response-check-api");
        if (res.status !== 200) {
          console.log("invalid meeting id");
          setError(res.ok);
          throw new Error("Invalid Meeting ID");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setMeetings(data);
        setError();
        console.log("the meeting details", data.value);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error fetching meeting details", error);
      });
  }, []);

  return (
    <div className="App">
      {error ? (
        <p style={{marginLeft:"420px", color:"red", fontSize:"16px"}}>This meeting is not compatible for this App !!!</p>
      ) : meetings ? (
        <div>
          <table style={{marginTop:"-80px", marginLeft:"350px"}}>
            <tbody>
              <tr style={{ display: "none" }}>
                <td>Subject</td>
                <td>{meetings.Subject}</td>
              </tr>
              <tr style={{ display: "none" }}>
                <td>TimeZone</td>
                <td>{meetings.TimeZone}</td>
              </tr>
              <tr>
                <td dangerouslySetInnerHTML={{ __html: meetings.Content }}></td>
              </tr>

              <tr style={{ display: "none" }}>
                <td>MeetingID</td>
                {<td>{meetings.MeetingID}</td>}
              </tr>
            </tbody>
          </table>
          {/* <AddEmployee /> */}
        </div>
      ) : (
        <p>Loading ...</p>
      )}
    </div>
  );
};

export default MeetingSummary;
