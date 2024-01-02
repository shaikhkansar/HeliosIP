import React, { useState, useEffect } from "react";
import { Edit, Link2, UserPlus } from "react-feather";
import EditEntity from "./EditEntity";
import DeleteEntity from "./DeleteEntity";

const Dynamics365Entity = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);
  const [editedUsers, setEditedUsers] = useState({});
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
    const newFormErrors = { EmployeesID: false, FirstName: false, LastName: false };

    for (const field in formData) {
      if (formData[field] === "") {
        newFormErrors[field] = true;
        hasErrors = true;
      } else {
        newFormErrors[field] = false;
      }
    }

    if (hasErrors) {
      return;
    }

    try {
      const response = await fetch( //AddEntity flow Url
        "https://prod-15.centralindia.logic.azure.com:443/workflows/7bdc8dc16bba4da790e2f870e4b4e386/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9LmJc1NHPZY7OOwgz1I7qQkO56rFJuxAcnT8wZ2ytn0",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      console.log("API response:", response);
      
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);

        console.log("Request successful!");
      } else {
        console.log("API error:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
    useEffect(() => {   // dynamic365 Flow
    fetch(
      "https://prod-09.centralindia.logic.azure.com:443/workflows/956a793c1fd24402a24e7444d476dcee/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ETojxJWXOIgiskFgv8keTaJhaY2HoSATeD_t52WYWCY",
      { method: "POST" }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(
        (data) => {
          setIsLoaded(true);
          console.log("Fetched data:", data);
          setUsers(data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
          console.error("Fetch error:", error);
        }
      );
  }, []);
  
  

  const handleInputChange = (event, userId, field) => {
    const value = event.target.value;
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [userId]: { ...prevEditedUsers[userId], [field]: value },
    }));
  };

  const handleAdd = () => {
    const newUser = { ...formData, ItemLink: formData.ItemLink || "" };
    setUsers([...users, newUser]);
    setFormData({ EmployeesID: "", FirstName: "", LastName: "", ItemLink: "" });
  };

  const handleEdit = (user) => {
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [user.EmployeesID]: { ...user, isEditing: true },
    }));
  };

  const handleSave = async (userId) => {
    try {
      const editedUser = editedUsers[userId];

      const response = await fetch( //edit flow
        "https://prod-10.centralindia.logic.azure.com/workflows/6515b39ef48e4a24a3ad8982da8ad225/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ck8CwBwsoPdzdPlaU05INKBKg3wGQRFzYNEC18evopM",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EmployeesID: editedUser.EmployeesID,
            FirstName: editedUser.FirstName,
            LastName: editedUser.LastName,
          }),
        }
      );

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);

        setEditedUsers((prevEditedUsers) => ({
          ...prevEditedUsers,
          [userId]: {
            ...prevEditedUsers[userId],
            isEditing: false,
          },
        }));

        console.log("Edit request successful!");
      } else {
        console.log("API error:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleCancel = (employeesID) => {
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [employeesID]: { isEditing: false, data: null },
    }));
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch( //delete flow
        `https://prod-05.centralindia.logic.azure.com/workflows/fb561abe2fd341fe8051b63545c06a51/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=uxGd3W11Mv8noIsd2E1qzANPjzaIqq85KfJcsg7OPhU`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EmployeeID: userId,
          }),
        }
      );

      if (response.ok) {
        const updatedUsers = users.filter((user) => user.EmployeesID !== userId);
        setUsers(updatedUsers);
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 2000);
        console.log("Delete request successful!");
      } else {
        console.log("Delete request failed. Server response:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.EmployeesID, user.FirstName, user.LastName, user.ItemLink]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
         {saveSuccess && (
        <h6 style={{ color: "green", marginTop: "10px", marginLeft: "410px", whiteSpace: "nowrap" }}>
          Employee saved successfully!
        </h6>
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
            onChange={handleChange}
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
              >
                <UserPlus />
              </button>
            </div>
          </div>
        </form>
        </div>

        <div className="search-container">
          <div className="search-input">
            <div className="handle-search">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="results-container">
            <table className="table table-hover table-container">
              <thead>
                <tr className="sticky-header">
                  <th>Emp.id</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Item Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.EmployeesID}>
                    {["EmployeesID", "FirstName", "LastName"].map((field) => (
                      <td key={field}>
                        {editedUsers[user.EmployeesID]?.isEditing ? (
                          <input
                            placeholder={field === "EmployeesID" ? "Emp-id" : field}
                            className="form-control edit-input"
                            type="text"
                            value={editedUsers[user.EmployeesID]?.[field]}
                            onChange={(event) =>
                              handleInputChange(event, user.EmployeesID, field)
                            }
                            style={{
                              marginLeft: "-2px",
                            }}
                          />
                        ) : (
                          user[field]
                        )}
                      </td>
                    ))}
                    <td>
                      <div className="link2-container">
                        <span
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Click to go to the Employee Details"
                        >
                          <Link2
                            size="22px"
                            color="#5b5fc7"
                            onClick={() => window.open(`${user.ItemLink}`, "_blank")}
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="edit-icons-container">
                        {editedUsers[user.EmployeesID]?.isEditing ? (
                          <EditEntity
                            user={user}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            handleInputChange={handleInputChange}
                            editedUsers={editedUsers}
                          />
                        ) : (
                          <>
                            <span
                              className=""
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Edit"
                            >
                              <Edit
                                size="20px"
                                cursor="pointer"
                                color="#5b5fc7"
                                onClick={() => handleEdit(user)}
                                className="edit-icon"
                              />
                            </span>
                            <DeleteEntity user={user} handleDelete={handleDelete} />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
};

export default Dynamics365Entity;
