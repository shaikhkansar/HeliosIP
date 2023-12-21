function createmeeting(primaryControl) {
  console.log("inside create function call");
  try {
    var itemlink = window.parent.location.href;
    var formContext = primaryControl;
    var stremployeeid = formContext.getAttribute("crea6_employeeid").getValue();
    var strname = formContext.getAttribute("crea6_firstname").getValue();
    var strlname = formContext.getAttribute("crea6_lastname").getValue();
    var strtitle = formContext.getAttribute("crea6_title").getValue();
    var strmessage = formContext.getAttribute("crea6_message").getValue();
    var strmessage = "<a href='" + itemlink + "'" + " style='cursor: pointer; color: blue; text-decoration: underline;' target='_blank'>Click here to go to the entity item here<br></a>";
    var strtimezone = formContext.getAttribute("crea6_timezone").getValue();
    var strstartdate = formContext.getAttribute("crea6_startdate").getValue();
    var strenddate = formContext.getAttribute("crea6_enddate").getValue();
    var strattendees = formContext.getAttribute("crea6_attendees").getValue();
    varConvertedstartDate = strstartdate.toISOString();
    varConvertedendDate = strenddate.toISOString();
    
    
    
 
    var tableHTML = "<p>This is Schedule to discuss for following item.</P><br><table>" +
                        "<tr><td>Title</td><td>" + strtitle + "</td></tr>" +
 			
                        "<tr><td>Employee ID</td><td>" + stremployeeid + "</td></tr>" +
                        "<tr><td>First Name</td><td>" + strname + "</td></tr>" +
                        "<tr><td>Last Name</td><td>" + strlname + "</td></tr>" +
                        "<tr><td colspan=2>"+ strmessage + "</td></tr>"
                       "</table>";

      var strmessageWithTable = tableHTML;
 
 
    const response = fetch(
      "https://prod-23.centralindia.logic.azure.com:443/workflows/b2d893d2e211438a8a1784f3089c7f69/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1rTAmjcI7yUEPjz-3pFxmFl00ZsOI6p-8iTM1SQAWGY",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
         body: JSON.stringify({
            EmployeeId: stremployeeid,
            FirstName: strname,
            LastName: strlname,
            Subject: strtitle,
            Message: strmessageWithTable,
            TimeZone: strtimezone,
            Starttime: varConvertedstartDate,
            Endtime: varConvertedendDate,
            Attendees: strattendees
          }),
      }
    ).then((response) => {
      console.log("response after fetch", response);
 
      if (response.ok) {
        // Show success message with complete details
        // Example: setIsPopup(true); with a success message
        // setIsPopup(true);
        console.log("Request successful!");
//       meetingid = response.json()["metingid'];
//get MeetingID
//then update here
       // formContext.getAttribute("cre6_meetingid").setValue(meetingid); 

      } else {
        // Handle API error
        console.log("API error:", response);
      }
    });
  } catch (error) {
    console.error("Network error:", error);
  }
 
  alert("Meeting created successfully!!!");
}