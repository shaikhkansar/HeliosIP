import React, { useState, useEffect } from "react";
import AddEmployee from "./AddEmployee";
import Dynamics365Entity from "./Dynamics365Entity";

const MeetingSummary = ({ MeetingID  }) => {
  const [meetings, setMeetings] = useState(null);
  const [error, setError] = useState(true);

  useEffect(() => {
    console.log(MeetingID, "chatId url")

    fetch("https://prod-12.centralindia.logic.azure.com:443/workflows/7dcc34dfa675415090f2b1316ec4ff60/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=H9u6thBJzYFfTwmNZDDzr4QseMH0JSJKMmT-XWk3qzU", {
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
          meetingid: data.onlineMeetingInfo.calendarEventId
          // eventIdFromUrl,
          // "AAMkADBjMzUwZTk2LTNjZjQtNDg4OC05NGUzLWMzMjcwZGQzZDRlZgBGAAAAAABOL2KklS2zQ7eN7Yf7kB1dBwB6HKPOO2MUSrLAZ9rx2s0hAAAAAAENAAB6HKPOO2MUSrLAZ9rx2s0hAAEOj4QMAAA=",
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
