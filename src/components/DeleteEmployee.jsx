// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useHistory } from "react-router-dom";
// import "./App.css";

// function DeleteEmployee() {
//   const { id } = useParams();
//   const history = useHistory();

//   const [employeeData, setEmployeeData] = useState({
//     EmployeesID: "",
//     FirstName: "",
//     LastName: "",
//   });

//   const [isPopup, setIsPopup] = useState(false);

//   useEffect(() => {
//     // Fetch employee data based on the ID from the API and set the employeeData
//     const fetchEmployeeData = async () => {
//       try {
//         const response = await fetch(
//           `https://prod-13.centralindia.logic.azure.com:443/workflows/2b563d21a1594bf0bda46f4d6f339d3f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xdJobsYJ5kRA1HUtxevqV_PpSIOpW8TNPWHwS3qDqyY`, // Replace with your actual API endpoint
//           {
//             method: "POST",
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.ok) {
//           const data = await response.json();
//           setEmployeeData({
//             EmployeesID: data.EmployeesID,
//             FirstName: data.FirstName,
//             LastName: data.LastName,
//           });
//         } else {
//           // Handle API error
//           console.log("API error:", response);
//         }
//       } catch (error) {
//         console.error("Network error:", error);
//       }
//     };

//     fetchEmployeeData();
//   }, [id]);

//   const handleDelete = async () => {
//     // Add your delete logic here
//     let accessToken = "";
//     try {
//       const response = await fetch(
//         `https://prod-13.centralindia.logic.azure.com:443/workflows/2b563d21a1594bf0bda46f4d6f339d3f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xdJobsYJ5kRA1HUtxevqV_PpSIOpW8TNPWHwS3qDqyY`, // Replace with your actual API endpoint
//         {
//           method: "POST", // Use the appropriate HTTP method for deleting data
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify({
//             EmployeesID: employeeData.EmployeesID,
//           }),
//         }
//       );

//       if (response.ok) {
//         setIsPopup(true);
//         console.log("Delete request successful!");
//         // Redirect to the employee list after successful deletion
//         history.push("/dynamic365-entity");
//       } else {
//         // Handle API error
//         console.log("API error:", response);
//       }
//     } catch (error) {
//       console.error("Network error:", error);
//     }
//   };

//   return (
//     <div className="main-container">
//       {isPopup && (
//         <div className="popup">
//           <h6 className="text-success g-3">User deleted successfully!</h6>
//         </div>
//       )}

//       <button className="mb-2 btn btn-danger mb-4" onClick={handleDelete}>
//         Delete Employee
//       </button>

//       <div>
//         <p>Employee ID: {employeeData.EmployeesID}</p>
//         <p>First Name: {employeeData.FirstName}</p>
//         <p>Last Name: {employeeData.LastName}</p>
//       </div>

//       <button className="mb-2 btn btn-secondary">
//         <Link to="/dynamic365-entity" className="text-white text-decoration-none">
//           Cancel
//         </Link>
//       </button>
//     </div>
//   );
// }

// export default DeleteEmployee;
