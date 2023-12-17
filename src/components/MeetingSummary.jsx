import React, { useState, useEffect,useContext  } from "react";
import AddEmployee from "./AddEmployee";
import Dynamics365Entity from "./Dynamics365Entity";

const MeetingSummary = ({ meetingId }) => {
  const [meetings, setMeetings] = useState(null);
  const [error, setError] = useState(true);

    useEffect(() => {
      const url = new URL("https://teams.microsoft.com/_#/scheduling-form/?isBroadcast=false&eventId=AAMkADBjMzUwZTk2LTNjZjQtNDg4OC05NGUzLWMzMjcwZGQzZDRlZgBGAAAAAABOL2KklS2zQ7eN7Yf7kB1dBwB6HKPOO2MUSrLAZ9rx2s0hAAAAAAENAAB6HKPOO2MUSrLAZ9rx2s0hAAEGhxJbAAA%3D&conversationId=19:meeting_YjEzNDNjMzAtMjUzMC00MWZhLTg3OTctZDQxOTE2MjNkMjM5@thread.v2&opener=1&providerType=0&navCtx=navigateHybridContentRoute&calendarType=1");
      // Extract the meetingId from the URL hash
      const hashParams = new URLSearchParams(url.hash.slice(1));
      const meetingIdFromUrl = hashParams.get('eventId');
      // const meetingIdFromUrl = url.searchParams.get("eventId");
    
      // Replace the placeholder with the actual meetingId
      const apiUrl = "https://prod-27.centralindia.logic.azure.com:443/workflows/84d9c85cd2fd43509af9186e4d93133d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ubO2vmGZz2ZBkE6BDMHpOyr3aTI-CRmsktVAR9xV9bE".replace("{eventId}", meetingIdFromUrl);
  
    fetch(
      apiUrl ,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meetingid:  meetingIdFromUrl,
            // "AAMkADBjMzUwZTk2LTNjZjQtNDg4OC05NGUzLWMzMjcwZGQzZDRlZgBGAAAAAABOL2KklS2zQ7eN7Yf7kB1dBwB6HKPOO2MUSrLAZ9rx2s0hAAAAAAENAAB6HKPOO2MUSrLAZ9rx2s0hAAEHlhhOAAA%3D",
        }),
       }
    )
      .then((res) => {
        console.log(res, "Response-check-api");
        if (res.status !== 200) {
          console.log("invalid meeting id");
          setError(res.ok);
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
  }, []);

  return (
    <div className="App" style={{ marginTop: "-55px", marginRight: "60px" }}>
    {error ? (
      <p style={{ marginLeft: "80px", color: "red", fontSize: "16px" }}>
        {error} 
      </p>
    ) : meetings ? (
      <div>
        <AddEmployee />
        <Dynamics365Entity />
        <table style={{ marginTop: "20px", marginLeft: "350px" }}>
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
              <td>{meetings.MeetingID}</td>
            </tr>
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
