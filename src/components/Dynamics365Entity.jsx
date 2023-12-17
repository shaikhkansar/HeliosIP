import React, { useState, useEffect } from "react";
import { UserPlus, Save, Edit, Link2, Trash2, XSquare } from "react-feather";
import EditEmployee from "./EditEntity";
import DeleteEmployee from "./DeleteEmployee";

const Dynamics365Entity = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);
  const [editedUsers, setEditedUsers] = useState({});

  const [formData, setFormData] = useState({
    EmployeeID: "",
    FirstName: "",
    LastName: "",
  });

  const handleIdChange = (e) => {
    setFormData({
      ...formData,
      EmployeesID: e.target.value,
    });
  };

  const handleFirstNameChange = (e) => {
    setFormData({
      ...formData,
      FirstName: e.target.value,
    });
  };

  const handleLastNameChange = (e) => {
    setFormData({
      ...formData,
      LastName: e.target.value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAdd = () => {
    const newUser = {
      EmployeesID: formData.EmployeesID,
      FirstName: formData.FirstName,
      LastName: formData.LastName,
      ItemLink: formData.ItemLink,
    };
    setUsers([...users, newUser]);
    setFormData({
      EmployeesID: "",
      FirstName: "",
      LastName: "",
      ItemLink: "",
    });
  };
  const handleEdit = (user) => {
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [user.EmployeesID]: {
        ...user,
        isEditing: true,
      },
    }));
  };

  const handleInputChange = (event, userId, field) => {
    const value = event.target.value;
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [userId]: {
        ...prevEditedUsers[userId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (userId) => {
    try {
      // Assuming editedUsers is the state holding the edited user data
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
        // Update the local state or perform any additional actions if needed
        setEditedUsers((prevEditedUsers) => {
          const updatedState = {
            ...prevEditedUsers,
            [userId]: {
              ...prevEditedUsers[userId],
              isEditing: false,
            },
          };
          console.log("Updated State:", updatedState);
          return updatedState;
        });
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
    // Assuming editedUsers is a state variable and setEditedUsers is a function to update it
    setEditedUsers((prevEditedUsers) => {
      const updatedUsers = { ...prevEditedUsers };

      // Revert any changes made during editing by resetting the edited user state
      updatedUsers[employeesID] = { isEditing: false, data: null };

      return updatedUsers;
    });
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
        // Remove the deleted user from the state
        const updatedUsers = users.filter(
          (user) => user.EmployeesID !== userId
        );
        setUsers(updatedUsers);
        console.log("Delete request successful!");
      } else {
        // Handle API error
        console.log("Delete request failed. Server response:", response);
      }
    } catch (error) {
      // Handle network error
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

  /*
  fetch("https://reqres.in/api/reister",{
  method: "POST",
  headers : {
    Accept:"application/json",
    "Content-Type" : "application/json",
  },
  body : JSON.stringify({
    "meetingId": "eve.holt@reres.in"
  }),
  })
  .then(( response) => response.json())
  .then((responseData) => {
    console.log(JSON.stringify(responseData));

  })
*/

  /*alert("here");
  useEffect(() => {
    fetch(
      "https://prod-27.centralindia.logic.azure.com:443/workflows/84d9c85cd2fd43509af9186e4d93133d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ubO2vmGZz2ZBkE6BDMHpOyr3aTI-CRmsktVAR9xV9bE",{
      method: "POST",
      headers : {
        Accept:"application/json",
        "Content-Type" : "application/json",
      },
      body : JSON.stringify({
        "meetingId": "AAMkADBjMzUwZTk2LTNjZjQtNDg4OC05NGUzLWMzMjcwZGQzZDRlZgBGAAAAAABOL2KklS2zQ7eN7Yf7kB1dBwB6HKPOO2MUSrLAZ9rx2s0hAAAAAAENAAB6HKPOO2MUSrLAZ9rx2s0hAAEAjk4qAAA="
      }),
      })
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          console.log(data);
          
          //setUsers(data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

*/
  

const filteredUsers = users.filter((user) => {
    
    return `${user.EmployeesID} ${user.FirstName} ${user.LastName} ${user.ItemLink}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
      
  });
  

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else {
    return (
      <div style={{ marginLeft: "190px", marginTop: "-20px" }}>
        {/* <Link
          to={`/add-employee`}
          class="btn btn-success"
          style={{ marginRight: "10px" }}
        >
          Home
        </Link> */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="text"
            class="form-control"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginLeft: "155px", marginTop: "20px", width: "335px" }}
          />
          {/* <Link
            to={`/edit-employee/${users.EmployeesID}`}
            style={{ width: "450px" }}
          > */}
          {/* <button
              class="btn btn-success d-grid gap-2 col-6 mx-auto"
              type="button"
            >
              <UserPlus
                size="30px"
                onClick={handleAdd}
                cursor="pointer"
                style={{ marginLeft: "-3px" }}
              />
            </button> */}
          {/* </Link> */}
        </div>
        <div
          style={{
            width: "335px",
            marginLeft: "155px",
            maxHeight: "200px",
            overflowY: "auto",
            marginTop: "10px",
          }}
        >
          <table
            className="table table-hover"
            style={{
              width: "520px",
              margin: "15 auto",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            <thead>
              <tr
                style={{
                  marginLeft: "20px",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f2f2f2",
                }}
              >
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
                  <td>
                    {editedUsers[user.EmployeesID]?.isEditing ? (
                      <input
                        class="form-control"
                        type="text"
                        value={editedUsers[user.EmployeesID]?.EmployeesID}
                        onChange={(event) =>
                          handleInputChange(
                            event,
                            user.EmployeesID,
                            "EmployeesID"
                          )
                        }
                        style={{ width: "80px" }}
                      />
                    ) : (
                      user.EmployeesID
                    )}
                  </td>
                  <td>
                    {editedUsers[user.EmployeesID]?.isEditing ? (
                      <input
                        class="form-control"
                        type="text"
                        value={editedUsers[user.EmployeesID]?.FirstName}
                        onChange={(event) =>
                          handleInputChange(
                            event,
                            user.EmployeesID,
                            "FirstName"
                          )
                        }
                        style={{ width: "80px" }}
                      />
                    ) : (
                      user.FirstName
                    )}
                  </td>
                  <td>
                    {editedUsers[user.EmployeesID]?.isEditing ? (
                      <input
                        class="form-control"
                        type="text"
                        value={editedUsers[user.EmployeesID]?.LastName}
                        onChange={(event) =>
                          handleInputChange(event, user.EmployeesID, "LastName")
                        }
                        style={{ width: "80px" }}
                      />
                    ) : (
                      user.LastName
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Link2
                        size="22px"
                        color="#5b5fc7"
                        onClick={() =>
                          window.open(`${user.ItemLink}`, "_blank")
                        }
                        style={{
                          cursor: "pointer",
                          marginTop: "-2px",
                          paddingTop: "4px",
                          marginRight: "50px",
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {editedUsers[user.EmployeesID]?.isEditing ? (
                        <>
                          <div
                            className=""
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Save"
                          >
                            <Save
                              size="20px"
                              onClick={() => handleSave(user.EmployeesID)}
                              cursor="pointer"
                              color="#5b5fc7"
                              style={{ marginRight: "10px" }}
                            />
                          </div>
                          <span
                            className=""
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Cancel"
                          >
                            <XSquare
                              size="20px"
                              onClick={() => handleCancel(user.EmployeesID)}
                              cursor="pointer"
                              color="red"
                              style={{ marginRight: "10px" }}
                            />
                          </span>
                        </>
                      ) : (
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
                            style={{ marginRight: "25px" }}
                          />
                        </span>
                      )}
                      <span
                        className=""
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Delete"
                      >
                        <Trash2
                          size="20px"
                          cursor="pointer"
                          color="Red"
                          style={{ marginRight: "25px" }}
                          onClick={() => handleDelete(user.EmployeesID)}
                        />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default Dynamics365Entity;
