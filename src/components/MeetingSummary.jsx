import React, { useState, useEffect } from "react";
import AddEmployee from "./AddEmployee";
import Dynamics365Entity from "./Dynamics365Entity";

const MeetingSummary = ({ MeetingID  }) => {
  const [meetings, setMeetings] = useState(null);
  const [error, setError] = useState(true);

  useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.href);
    const eventIdFromUrl = urlParams.get("eventId") || "";
    console.log(window.location.href, "event url")

    fetch("https://prod-23.centralindia.logic.azure.com:443/workflows/d54609ee409d43c585faadc8662fdef2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2QMl4KEiiLAbl6HVYCT77ZkKK2nfJj2aAmX-JjYTpwo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meetingid: 
        // eventIdFromUrl,
        "AAMkAGE1ZDY0NTUwLWI1NzAtNDY1ZC05NmNlLWVkZjRhZjA5OGNlYgBGAAAAAADNK1DG-ahMQIy43ILp9pGJBwC7OR04RU5FTI1XBVGTm0B3AAAAAAENAAC7OR04RU5FTI1XBVGTm0B3AABIKL2gAAA%3D",
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
      setMeetings(data);
      setError(null);
      console.log("the meeting details", data.value);
    })
    .catch((error) => {
      setError(error.message);
      console.error("Error fetching meeting details", error);
    });
}, [MeetingID]);

  return (
    <div className="App" style={{ marginTop: "-55px", marginRight: "60px" }}>
      {error ? (
        <p style={{ marginLeft: "80px", color: "red", fontSize: "16px" }}>
          {error}
        </p>
      ) : meetings ? (
        <div>
          {/* <AddEmployee /> */}
          <Dynamics365Entity />
          <table style={{ marginTop: "20px", marginLeft: "350px" }}>
            <tbody>
              {/* <tr style={{ display: "none" }}>
                <td>Subject</td>
                <td>{meetings.Subject}</td>
              </tr> */}
              {/* <tr style={{ display: "none" }}>
                <td>TimeZone</td>
                <td>{meetings.TimeZone}</td>
              </tr> */}
              <tr>
                <td dangerouslySetInnerHTML={{ __html: meetings.Content }}></td>
              </tr>
              
              {/* <tr style={{ display: "block" }}>
                <td>MeetingID</td>
                <td>{meetings.meetingid}</td>
              </tr> */}
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
