import React, { useState, useEffect, useReducer } from "react";
import { Edit, Link2 } from "react-feather";
import EditEmployee from "./EditEmployee";
import DeleteEmployee from "./DeleteEmployee";
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

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleInputChange = (event, userId, field) => {
    const value = event.target.value;
    console.log("Before state update:", editedUsers);
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [userId]: { ...prevEditedUsers[userId], [field]: value },
    }));
    console.log("After state update:", editedUsers);
    // setTimeout(() => forceUpdate(), 10);
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

      const response = await fetch(
        "https://prod-21.centralindia.logic.azure.com:443/workflows/1290c468508e4c41b259ad86daac3852/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KBx5zqzkElvYM9vL2rzoZ0BQBsUYE1Q8zYjej-GiFSE",
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
            // Add other properties if needed
          }),
        }
      );

      if (response.ok) {
        setSaveSuccess(true); // Set saveSuccess to true after successful save
        setTimeout(() => setSaveSuccess(false), 2000); // Automatically hide the message after 3000 milliseconds (3 seconds)

        setEditedUsers((prevEditedUsers) => ({
          ...prevEditedUsers,
          [userId]: {
            ...prevEditedUsers[userId],
            isEditing: false,
          },
        }));

        console.log("Edit request successful!");
      } else {
        // Handle API error
        console.log("API error:", response);
      }
    } catch (error) {
      // Handle network error
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
      const response = await fetch(
        `https://prod-22.centralindia.logic.azure.com:443/workflows/a1307a92ea314a5caadec200102b181c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=InDCrp4yrcmNPrORMRByPiYC3ZSnmnmSNObDsMLzvdM`,
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
      "https://prod-14.centralindia.logic.azure.com:443/workflows/217efe8467b24a79941bc0abbac4da30/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2tFlQ4aPY4GqLiyH2X0EkrqDHOliq0uY2cF4ZEaEK_E",
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

  useEffect(() => {
    console.log("Edited users updated:", editedUsers);
  }, [editedUsers]);

  const filteredUsers = users.filter((user) => {
    const searchString = [String(user.EmployeesID), user.FirstName, user.LastName, user.ItemLink]
      .join(" ")
      .toLowerCase();
  
    const searchQueryLower = searchQuery.toLowerCase();
  
    if (searchQuery.length === 1 && /^\d$/.test(searchQueryLower)) {
      // If the search query is a single digit, allow searching for a single-digit Employee ID
      return String(user.EmployeesID).includes(searchQueryLower);
    }
  
    // Otherwise, perform the standard search
    return searchString.includes(searchQueryLower);
  });
  

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
                            placeholder={field === "EmployeesID" ? "Emp-id" : field}
                            className="form-control edit-input"
                            type="text"
                            value={editedUsers[user.EmployeesID]?.[field] || user[field]}
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
                          <EditEmployee
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
                            <DeleteEmployee
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
