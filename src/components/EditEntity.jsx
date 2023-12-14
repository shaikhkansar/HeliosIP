import React, { useState, useEffect } from "react";
 
const EditEntity = () => {
 
  const [meetings, setMeetings] = useState([]);
 
  useEffect(() => {
  fetch("https://prod-21.centralindia.logic.azure.com:443/workflows/1290c468508e4c41b259ad86daac3852/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KBx5zqzkElvYM9vL2rzoZ0BQBsUYE1Q8zYjej-GiFSE",{
    method: "POST",
    headers : {
      Accept:"application/json",
      "Content-Type" : "application/json",
    },
    body : JSON.stringify({
      "EmployeesID": "3",
      "FirstName": "Kamil",
      "LastName": "Khan",
      "Title" : " meeting is Changed ",
      "Message" : "This meeting is schedule For Demo purpose",
      "Timezone" : "Eastern Standard Time",
      "StartDate" : "12/5/2023 4:30 PM",
      "EndDate" : "12/5/2023 5:00 PM",
      "Attendees" : "Ansar.Shaikh@springuplabs.com; Intekhab.shaikh@springuplabs.com"
  }),
    })
   
  }, []);
 
  return (
   
    <div className="App">
     
    </div>
  );
}
 
export default EditEntity;