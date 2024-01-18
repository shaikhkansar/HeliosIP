import { useState, useEffect } from "react";
import { UserPlus } from "react-feather";
import "./AddEmployee.css";

const AddEmployee = ({ deleteSuccess, saveSuccess, updateUsers, users}) => {
  const [formData, setFormData] = useState({
    EmployeesID: "",
    FirstName: "",
    LastName: "",
  });

  const [formErrors, setFormErrors] = useState({
    EmployeesID: false,
    FirstName: false,
    LastName: false,
  });

  const [isPopup, setIsPopup] = useState(false);
  const [isDuplicatePopup, setIsDuplicatePopup] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Allow empty string for deletion
    if (value === "") {
      handleChange(e); // Update state even if empty
      return;
    }
  
    // Check for valid characters in names
    if (name === "FirstName" || name === "LastName") {
      if (!/^[A-Za-z ]+$/.test(value)) {
        return;
      }
    }
  
   handleChange(e); // Update state
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

   // Check if user ID already exists
   const userIdExists = users.some(user => user.EmployeesID === formData.EmployeesID);

   if (userIdExists) {
    setIsDuplicatePopup(true);
     return; // Return without making the API call
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
        updateUsers(formData);
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
  const clearPopup = () => {
    setIsPopup(false);
    setIsDuplicatePopup(false);
  };

  if (isPopup || isDuplicatePopup) {
    const timeout = setTimeout(clearPopup, 3000);

    return () => clearTimeout(timeout);
  }
}, [isPopup, isDuplicatePopup]);


  return (
    <>
      {isPopup && (
        <div
          className="alert alert-success g-3 successpopup"
          id="success-alert"
        >
          <strong>Success! </strong> User added successfully!
        </div>
      )}
       {isDuplicatePopup  && (
        <div
          className="alert alert-danger g-3 successpopup"
          id="duplicate-alert"
        >
          <strong>Error: </strong> User ID already exists!
        </div>
      )}
      {deleteSuccess && (
        <div class="alert alert-danger g-3 successpopup" id="success-alert">
          <strong>Delete:</strong> Record deleted.
        </div>
      )}
      {saveSuccess && (
        <div class="alert alert-success g-3 successpopup" id="success-alert">
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
                  className={`form-control ${
                    formErrors[field] ? "is-invalid" : ""
                  } form-control2`}
                  placeholder={field === "EmployeesID" ? "User ID" : field}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                />
                {formErrors[field] && (
                  <div className="invalid-feedback">
                    {`Please fill in ${
                      field === "EmployeesID" ? "User ID" : field
                    }`}
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
