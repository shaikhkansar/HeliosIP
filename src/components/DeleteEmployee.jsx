import React, { useState } from "react";
import { Trash2, XSquare } from "react-feather";
import { Modal } from "react-bootstrap";

const DeleteEmployee = ({ user, handleDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
    setDeleteSuccess(false); // Reset deleteSuccess when opening the modal
  };
  const handleCloseModal = () => setShowModal(false);

  const confirmDelete = () => {
    // Proceed with deletion logic
    handleDelete(user.EmployeesID);
    // Close the modal after deletion
    handleCloseModal();
     // Set deleteSuccess to true after successful deletion
     setDeleteSuccess(true);
       // Automatically hide the message after 3000 milliseconds (3 second)
    setTimeout(() => setDeleteSuccess(false), 1000);
  };

  return (
    <>
   
   
    <span className="" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
      <Trash2
        size="20px"
        cursor="pointer"
        color="Red"
        style={{ marginRight: "25px" }}
        onClick={handleShowModal}
        className="delete-icon"
      />

      <Modal show={showModal} onHide={handleCloseModal} centered size="sm">
        <Modal.Body style={{ maxHeight: "80px", overflowY: "auto"}}>
          Are you sure you want to delete the employee?
        </Modal.Body>
        <Modal.Footer>
          <span data-bs-toggle="tooltip" data-bs-placement="right" title="Cancel">
            <XSquare onClick={handleCloseModal} color="red" cursor="pointer" style={{marginTop:"4px"}} />
          </span>
          <span data-bs-toggle="tooltip" data-bs-placement="right" title="Delete">
            <Trash2
              variant="danger"
              onClick={confirmDelete}
              color="red"
              cursor="pointer"
            />
          </span>
        </Modal.Footer>
      </Modal>
    </span>
    </>
  );
};

export default DeleteEmployee;
