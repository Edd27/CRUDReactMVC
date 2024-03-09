import { useContext, useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';
import { AppContext } from '../App';

const initialValues = {
    id: 0,
    name: '',
    email: '',
    phone: ''
};

export default function ContactsModal({ open, onClose, contactId = null }) {
    const [values, setValues] = useState(initialValues);
    const [error, setError] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { setContacts, contacts } = useContext(AppContext);

    async function handleSubmit(e) {
        setSubmitting(true);
        try {
            e.preventDefault();
            const url = contactId ? `/api/contacts/${contactId}` : '/api/contacts';
            const response = await fetch(url, {
                method: contactId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(values)
            });
            if (!response.ok) {
                throw new Error("Error saving changes");
            }
            const data = await response.json();
            e.target.reset();
            onClose();
            setContacts((prev) => contactId ? prev.map((c) => c.id === contactId ? data : c) : [data, ...prev]);
        } catch (e) {
            console.error(e);
            setError(true);
        }
        setSubmitting(false);
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        if (contactId) {
            const contact = contacts.find((c) => c.id === contactId);
            if (contact) {
                setValues(contact);
            }
        }
    }, [contactId])

    return (
        <Modal isOpen={open} centered>
            <ModalHeader>
                {contactId ? "Update contact" : "New contact"}
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" id="name" value={values.name} onChange={handleInputChange} placeholder="Jon Doe" />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input name="email" id="email" type="email" value={values.email} onChange={handleInputChange} placeholder="Xr8oQ@example.com" />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="phone">Phone</Label>
                        <Input name="phone" id="phone" type="tel" value={values.phone} onChange={handleInputChange} placeholder="555-555-5555" />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" size="sm" type="submit" disabled={submitting}>
                        {submitting ? (
                            <>
                                <Spinner size="sm">
                                    Loading...
                                </Spinner>
                                <span>{contactId ? " Updating" : " Saving"}</span>
                            </>
                        ) : contactId ? "Update" : "Save"}
                    </Button>
                    <Button color="danger" size="sm" onClick={onClose} type="button" disabled={submitting}>Cancel</Button>
                </ModalFooter>
            </Form>
        </Modal>
    )
}