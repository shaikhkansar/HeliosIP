import React, { useState, useEffect, useReducer } from "react";
import { Edit, Link2, Search } from "react-feather";
import EditEntity from "./EditEmployee";
import DeleteEntity from "./DeleteEmployee";
import AddEmployee from "./AddEmployee";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

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
  const [forceRender, setForceRender] = useState(0);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

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

  const updateUsers = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleAdd = () => {
    // Check if the EmployeesID already exists
    const isDuplicate = users.some((user) => user.EmployeesID === formData.EmployeesID);
  
    if (isDuplicate) {
      
      return;
    }
  
    // Add employees in sequence
    const nextEmployeesID = users.length > 0 ? users[users.length - 1].EmployeesID + 1 : 1;
  
    const newUser = {
      ...formData,
      EmployeesID: formData.EmployeesID || nextEmployeesID,
      ItemLink: formData.ItemLink || ""
    };
  
    setUsers([...users, newUser]);
    setEditedUsers({});
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
        setTimeout(() => setSaveSuccess(false), 3000); // Automatically hide the message after 3000 milliseconds (3 seconds)

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
        setTimeout(() => setDeleteSuccess(false), 3000); // Automatically hide the message after 3000 milliseconds (3 seconds)
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
          console.log("API response:", data);
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
    console.log("Edited users updated:", editedUsers, users);
    setForceRender((prev) => prev + 1);
  }, [editedUsers, users]);

  const filteredUsers = Array.isArray(users)
  ? users.filter((user) => {
      const searchString = [
        String(user.EmployeesID),
        user.FirstName,
        user.LastName,
        user.ItemLink,
      ]
        .join(" ")
        .toLowerCase();

      const searchQueryLower = searchQuery.toLowerCase();

      if (searchQuery.length === 1 && /^\d$/.test(searchQueryLower)) {
        // If the search query is a single digit, allow searching for a single-digit Employee ID
        return String(user.EmployeesID).includes(searchQueryLower);
      }

      // Otherwise, perform the standard search
      return searchString.includes(searchQueryLower);
    })
  : [];

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else {
    return (
      <>
        <AddEmployee deleteSuccess={deleteSuccess} saveSuccess={saveSuccess}  updateUsers={updateUsers} users={users}/>
        <div className="search-container">
          <div className="search-input">
            <div className="handle-search">
              <div className="search-icon">
                <Search />
              </div>
              <input
                type="text"
                className="form-control search-control"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="results-container">
          <Table className="table table-hover table-container">
  <Thead>
    <Tr className="sticky-header">
      <Th>Emp.id</Th>
      <Th>First Name</Th>
      <Th>Last Name</Th>
      <Th>Item Link</Th>
      <Th>Actions</Th>
    </Tr>
  </Thead>
  <Tbody>
    {filteredUsers.map((user) => (
      <Tr key={user.EmployeesID} className="user-td">
        {["EmployeesID", "FirstName", "LastName"].map((field) => (
          <Td key={field}>
            {editedUsers[user.EmployeesID]?.isEditing ? (
              <input
                placeholder={field === "EmployeesID" ? "Emp-id" : field}
                className="form-control edit-input"
                type="text"
                value={
                  editedUsers[user.EmployeesID]?.[field] || user[field]
                }
                onChange={(event) =>
                  handleInputChange(event, user.EmployeesID, field)
                }
                style={{
                  marginLeft: "-2px",
                }}
              />
            ) : (
              editedUsers[user.EmployeesID]?.[field] || user[field]
            )}
          </Td>
        ))}
        {/* Adjust the column for Item Link based on your requirements */}
        <Td>
          <div className="link2-container">
            <span
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Click to go to the Employee Details"
            >
              {/* Replace Link2 with the appropriate component */}
              {/* Assuming Link2 is a custom component */}
              <Link2
                size="22px"
                color="#5b5fc7"
                onClick={() =>
                  window.open(`${user.ItemLink}`, "_blank")
                }
              />
            </span>
          </div>
        </Td>
        <Td>
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
        </Td>
      </Tr>
    ))}
  </Tbody>
</Table>
          </div>
        </div>
      </>
    );
  }
};

export default Dynamics365Entity;
