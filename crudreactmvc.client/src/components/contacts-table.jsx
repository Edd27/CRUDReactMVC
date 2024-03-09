import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import EditContact from "./contacts-modal.jsx";
import { useContext, useState } from "react";
import { AppContext } from "../App.jsx";
import { useEffect } from "react";

export default function ContactsTable() {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { contacts, setContacts } = useContext(AppContext);

    function handleClickEdit(id) {
        setCurrentId((prev) => id);
        setShowModal(true);
    }

    function handleClickDelete(id) {
        setCurrentId((prev) => id);
        setShowDeleteModal(true);
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            const response = await fetch(`/api/contacts/${currentId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error("Error deleting contact");
            }
            setShowDeleteModal(false);
            setContacts((prev) => prev.filter((c) => c.id !== currentId));
            setCurrentId(null);
        } catch (e) {
            console.error(e);
        }
        setDeleting(false);
    }

    useEffect(() => {
        if (!showModal && !showDeleteModal) {
            setCurrentId(null);
        }
    }, [showModal, showDeleteModal])

    return (
        <Table striped responsive>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {contacts.length === 0 ? (
                    <tr>
                        <td colSpan={4}>No contacts found</td>
                    </tr>
                ) : contacts.map((contact) => (
                    <tr key={contact.id}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone}</td>
                        <td className="d-flex align-items-center gap-2 justify-content-end">
                            <Button color="primary" size="sm" onClick={() => handleClickEdit(contact.id)}>Edit</Button>
                            <Button color="danger" size="sm" onClick={() => handleClickDelete(contact.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
            <EditContact open={showModal} onClose={() => setShowModal(false)} contactId={currentId} />
            <Modal isOpen={showDeleteModal} centered>
                <ModalHeader>
                    Delete contact
                </ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this contact?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" size="sm" onClick={handleDelete} >
                        {deleting ? (
                            <>
                                <Spinner size="sm">
                                    Loading...
                                </Spinner>
                                <span>Deleting</span>
                            </>
                        ) : "Delete"}
                    </Button>
                    <Button color="danger" size="sm" onClick={() => setShowDeleteModal(false)} type="button" >Cancel</Button>
                </ModalFooter>
            </Modal>
        </Table>
    )
}