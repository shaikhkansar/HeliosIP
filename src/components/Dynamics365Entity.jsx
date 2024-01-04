import React, { useState, useEffect } from "react";
import { Edit, Link2 } from "react-feather";
import EditEntity from "./EditEntity";
import DeleteEntity from "./DeleteEntity";
import AddEmployee from "./AddEmployee";

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

  const handleInputChange = (event, userId, field) => {
    const value = event.target.value;
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [userId]: { ...prevEditedUsers[userId], [field]: value },
    }));
  };

  const handleAdd = () => {
    const newUser = { ...formData, ItemLink: formData.ItemLink || "" };
    setUsers((prevUsers) => [...prevUsers, newUser]); // Use a functional update to ensure consistency
    setFormData({ EmployeesID: "", FirstName: "", LastName: "", ItemLink: "" });
  };
  

  const handleEdit = (user) => {
    setEditedUsers((prevEditedUsers) => ({
      [user.EmployeesID]: { ...user, isEditing: true },
      ...Object.fromEntries(Object.entries(prevEditedUsers).map(([userId, userData]) => [userId, { ...userData, isEditing: false }])),
    }));
  };
  
  const handleSave = async (userId) => {
    try {
      const editedUser = editedUsers[userId];
  
      // Immediately update the local state for the specific user being edited
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.EmployeeID === userId ? { ...user, ...editedUser } : user
        )
      );
  
      setEditedUsers((prevEditedUsers) => ({
        ...prevEditedUsers,
        [userId]: { ...prevEditedUsers[userId], isEditing: false },
      }));
  
      const response = await fetch(
        "https://prod-10.centralindia.logic.azure.com/workflows/6515b39ef48e4a24a3ad8982da8ad225/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ck8CwBwsoPdzdPlaU05INKBKg3wGQRFzYNEC18evopM",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EmployeeID: editedUser.EmployeeID, // Make sure this matches your data structure
            FirstName: editedUser.FirstName,
            LastName: editedUser.LastName,
            // Add other properties if needed
          }),
        }
      );
  
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        console.log("Edit request successful!");
      } else {
        console.error("API error:", response);
        // Optionally, handle the error or show an error notification to the user
      }
    } catch (error) {
      console.error("Network error:", error);
      // Optionally, handle the network error or show a network error notification to the user
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
      const response = await fetch(
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
        const updatedUsers = users.filter(
          (user) => user.EmployeesID !== userId
        );
        setUsers(updatedUsers);
        setDeleteSuccess(true); // Set deleteSuccess to true after successful deletion
        setTimeout(() => setDeleteSuccess(false), 2000); // Automatically hide the message after 3000 milliseconds (3 seconds)
        console.log("Delete request successful!");
      } else {
        console.log("Delete request failed. Server response:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetch(
      "https://prod-09.centralindia.logic.azure.com:443/workflows/956a793c1fd24402a24e7444d476dcee/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ETojxJWXOIgiskFgv8keTaJhaY2HoSATeD_t52WYWCY",
      { method: "POST" }
    )
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setUsers(data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const filteredUsers = users.filter((user) =>
    [user.EmployeesID, user.FirstName, user.LastName, user.ItemLink]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else {
    return (
      <>
        <AddEmployee deleteSuccess={deleteSuccess} saveSuccess={saveSuccess} />
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
                            placeholder={
                              field === "EmployeesID" ? "Emp-id" : field
                            }
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
                        <span  data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Click to go to the Employee Details">
                        <Link2
                          size="22px"
                          color="#5b5fc7"
                         
                          onClick={() =>
                            window.open(`${user.ItemLink}`, "_blank")
                          }
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
                            <DeleteEntity
                              user={user}
                              handleDelete={handleDelete}
                            />
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
