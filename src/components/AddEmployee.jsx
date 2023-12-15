import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import MeetingSummary from "./MeetingSummary";
import Dynamics365Entity from "./Dynamics365Entity";
import { UserPlus, Save, Edit, Link2 } from "react-feather";

function AddEmployee() {
  const [formData, setFormData] = useState({
    EmployeesID: "",
    FirstName: "",
    LastName: "",
  });
  const [isPopup, setIsPopup] = useState(false);
  const [formErrors, setFormErrors] = useState({
    EmployeesID: false,
    FirstName: false,
    LastName: false,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsPopup(true);
    setFormData({
      EmployeesID: "",
      FirstName: "",
      LastName: "",
    });
    // Check for errors
    let hasErrors = false;
    const newFormErrors = { ...formErrors };
 
    if (formData.EmployeesID === '') {
      newFormErrors.EmployeesID = true;
      hasErrors = true;
    } else {
      newFormErrors.EmployeesID = false;
    }
 
    if (formData.FirstName === '') {
      newFormErrors.FirstName = true;
      hasErrors = true;
    } else {
      newFormErrors.FirstName = false;
    }
 
    if (formData.LastName === '') {
      newFormErrors.LastName = true;
      hasErrors = true;
    } else {
      newFormErrors.LastName = false;
    }
 
    setFormErrors(newFormErrors);
 
    if (hasErrors) {
      return; // Do not submit the form if there are errors
    }
    try {
      const response = await fetch(
        "https://prod-21.centralindia.logic.azure.com:443/workflows/affd8cc9893948a2bae4cc4a65f9fa90/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4asos1JGB9vBj-v1DqJeNsJE_rb_dZsQRJDg3VI_2Zw",
       {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EmployeesID: `${formData.EmployeesID}`,
            FirstName: `${formData.FirstName}`,
            LastName: `${formData.LastName}`,
          }),
        }
      );
 
      if (response.ok) {
        // Show success message with complete details
        // Example: setIsPopup(true); with a success message
        setIsPopup(true);
        console.log("Request successful!");
      } else {
        // Handle API error
        console.log("API error:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
   
 
   
 
  useEffect(() => {
    if (isPopup) {
      const timeout = setTimeout(() => {
        setIsPopup(false);
      }, 2000); // Adjust the time in milliseconds (5 seconds in this example)
 
      return () => clearTimeout(timeout);
    }
  }, [isPopup]);
  return (
    <div className="main-container">
      {isPopup && (
        <div class="modal-dialog modal-dialog-centered" style={{marginLeft:"500",marginTop:"10px"}}>
          <h6 className="text-success g-3">User added successfully!</h6>
        </div>
      )}
         {/* <button class="mb-2 btn btn-success mb-4">
        <Link to="/dynamic365-entity" class="text-white text-decoration-none">
          Employee List
        </Link>
      </button> */}
 
      <form onSubmit={handleSubmit} style={{marginLeft:"350px", marginTop:"20px"}}>
      <div className="row mb-2">
  <div className="col">
    <input
      type="text"
      className={`form-control ${formErrors.EmployeesID ? 'is-invalid' : ''}`}
      placeholder="User Id"
      id="EmployeesID"
      name="EmployeesID"
      value={formData.EmployeesID}
      onChange={handleChange}
    />
    {formErrors.EmployeesID && <div className="invalid-feedback">Please fill in User ID</div>}
  </div>
  
  <div className="col">
    <input
      type="text"
      className={`form-control ${formErrors.FirstName ? 'is-invalid' : ''}`}
      placeholder="First name"
      id="FirstName"
      name="FirstName"
      value={formData.FirstName}
      onChange={handleChange}
    />
    {formErrors.FirstName && <div className="invalid-feedback">Please fill in First Name</div>}
  </div>
  
  <div className="col">
    <input
      type="text"
      className={`form-control ${formErrors.LastName ? 'is-invalid' : ''}`}
      placeholder="Last name"
      id="LastName"
      name="LastName"
      value={formData.LastName}
      onChange={handleChange}
    />
    {formErrors.LastName && <div className="invalid-feedback">Please fill in Last Name</div>}
  </div>
        <div class="d-grid gap-2 col-6  d-flex justify-content-left ">
        <button type="submit" className="btn btn-success" style={{backgroundColor:"#5b5fc7"}}>
      <UserPlus />
    </button>
        </div>
</div>

      </form>
<Dynamics365Entity/> 
<div style={{marginTop:"90px"}}><MeetingSummary/></div>


    </div>
  );
}
 
export default AddEmployee;