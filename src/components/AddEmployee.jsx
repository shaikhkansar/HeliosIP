import { useState, useEffect } from "react";
import { UserPlus } from "react-feather";
import "./AddEmployee.css";

const AddEmployee = ({ deleteSuccess, saveSuccess }) => {
  
  const [formData, setFormData] = useState({
    EmployeesID: "",
    FirstName: "",
    LastName: "",
  });
  const [users, setUsers] = useState([]);
  const [isPopup, setIsPopup] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);

  const [formErrors, setFormErrors] = useState({
    EmployeesID: false,
    FirstName: false, 
    LastName: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate only characters (letters)
    if (name === "FirstName" || name === "LastName") {
      if (!/^[A-Za-z ]+$/.test(value)) {
        return; // Do not update state if the input contains non-alphabetic characters
      }
    }

    handleChange(e); // Update state if validation passes
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check for duplicate Employee ID
    const isDuplicate = users.some((user) => user.EmployeesID === formData.EmployeesID);
  
    if (isDuplicate) {
      // Show duplicate popup
      setShowDuplicatePopup(true);
      return;
    }
  
    // Proceed with the submission if not a duplicate
    setFormData({
      EmployeesID: "",
      FirstName: "",
      LastName: "",
    });
  
  
    let hasErrors = false;
    const newFormErrors = { ...formErrors };
  
    for (const field in formData) {
      if (formData[field] === "") {
        newFormErrors[field] = true;
        hasErrors = true;
      } else {
        newFormErrors[field] = false;
      }
    }
  
    setFormErrors(newFormErrors);
  
    if (hasErrors) {
      return;
    }
    if (showDuplicatePopup) {
      alert("Employee ID already exists");
      setShowDuplicatePopup(false); // Reset the state to hide the popup
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
          body: JSON.stringify(formData),
        }
      );
  
      if (response.ok) {
        setIsPopup(true);
        console.log("Request successful!");
      } else {
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
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isPopup]);

  return (
    <>
      {isPopup && (
        // <h6 className="text-success g-3">User added successfully!</h6>
        <div class="alert alert-success g-3" id="success-alert" style={{ width: '58%', marginLeft:"350px" }}>
  {/* <button type="button" class="close" data-dismiss="alert">x</button> */}
  <strong>Success! </strong> User added successfully!
</div>
      )}
      {deleteSuccess && (
        // <h6
        //   className="text-success"
        //   style={{
        //     color: "green",
        //     marginTop: "10px",
        //     marginLeft: "410px",
        //     whiteSpace: "nowrap",
        //   }}
        // >
        //   Employee deleted successfully!
        // </h6>
        <div class="alert alert-danger g-3" id="success-alert" style={{ width: '58%', marginLeft:"350px" }}>
  {/* <button type="button" class="close" data-dismiss="alert">x</button> */}
  <strong>Delete:</strong> Record deleted.
</div>
      )}
      {saveSuccess && (
        // <h6
        //   style={{
        //     color: "green",
        //     marginTop: "10px",
        //     marginLeft: "410px",
        //     whiteSpace: "nowrap",
        //   }}
        // >
        //   Employee saved successfully!
        // </h6>
        <div class="alert alert-success g-3" id="success-alert" style={{ width: '58%', marginLeft:"350px" }}>
  {/* <button type="button" class="close" data-dismiss="alert">x</button> */}
  <strong>Success! </strong> Employee saved successfully!
</div>
      )}
      <div className="main-container">
        <form onSubmit={handleSubmit}>
        <div className="row mb-2">
      {["EmployeesID", "FirstName", "LastName"].map((field) => (
        <div key={field} className="col">
          <input
            type="text"
            className={`form-control ${formErrors[field] ? "is-invalid" : ""}`}
            placeholder={field === "EmployeesID" ? "User ID" : field}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
          />
          {formErrors[field] && (
            <div className="invalid-feedback">
              {`Please fill in ${field === "EmployeesID" ? "User ID" : field}`}
            </div>
          )}
        </div>
      ))}
      <div className="d-grid gap-2 col-6 d-flex justify-content-left">
        <button
          type="submit"
          className="btn btn-success"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Add Employees"
          onClick={handleSubmit}
        >
          <UserPlus />
        </button>
      </div>
    </div>
        </form>
      </div>
    </>
  );
};

export default AddEmployee;
