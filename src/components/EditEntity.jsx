import React from "react";
import { Save, XSquare } from "react-feather";

const EditEntity = ({
  user,
  handleSave,
  handleCancel,
  handleInputChange,
  editedUsers,
}) => {
  return (
    <>
      <div className="" data-bs-toggle="tooltip" data-bs-placement="top" title="Save">
        <Save
          size="20px"
          onClick={() => handleSave(user.EmployeesID)}
          cursor="pointer"
          color="#5b5fc7"
          style={{ marginRight: "27px", marginLeft:"-20px", marginTop:"10px"}}
        />
      </div>
      <span className="" data-bs-toggle="tooltip" data-bs-placement="top" title="Cancel">
        <XSquare
          size="20px"
          onClick={() => handleCancel(user.EmployeesID)}
          cursor="pointer"
          color="red"
          style={{ marginRight: "8px", marginTop:"10px"}}
        />
      </span>
    </>
  );
};

export default EditEntity;
