import React, { useState, useEffect } from "react";
import { UserPlus, Save, Edit, Link2, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
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
    EmployeesID: "",
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

  const handleSave = (userId) => {
    // Implement your save logic here
    // You can send the editedUsers[userId] data to your server or update it in your state
    setEditedUsers((prevEditedUsers) => ({
      ...prevEditedUsers,
      [userId]: {
        ...prevEditedUsers[userId],
        isEditing: false,
      },
    }));
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
            style={{ marginLeft: "160px", marginTop: "20px" }}
          />
          <Link
            to={`/edit-employee/${users.EmployeesID}`}
            style={{ width: "450px" }}
          >
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
          </Link>
        </div>
        <div style={{ width: "400px", marginLeft: "160px" }}>
          <table
            className="table table-hover"
            style={{ width: "500px", margin: "15 auto", backgroundColor:"white", borderRadius:"5px"}}
          >
            <thead>
              <tr marginLeft="20px">
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
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {editedUsers[user.EmployeesID]?.isEditing ? (
                        <Save
                          size="20px"
                          onClick={() => handleSave(user.EmployeesID)}
                          cursor="pointer"
                          color="#5b5fc7"
                        />
                      ) : (
                        <Edit
                          size="20px"
                          cursor="pointer"
                          color="#5b5fc7"
                          onClick={() => handleEdit(user)}
                        />
                      )}

                      <Trash2
                        size="20px"
                        cursor="pointer"
                        color="Red"
                        style={{ marginLeft: "15px" }}
                      />
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
