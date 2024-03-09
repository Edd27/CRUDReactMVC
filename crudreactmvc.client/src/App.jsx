import { createContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Button, Spinner } from "reactstrap";
import ContactsTable from './components/contacts-table';
import NewContact from './components/contacts-modal';

export const AppContext = createContext(null);

function App() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [showModal, setShowModal] = useState(false);

    async function fetchContacts() {
        setLoading(true);
        try {
            const res = await fetch("/api/contacts");
            const data = await res.json();
            setContacts(data);
        } catch (error) {
            setError(true);
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchContacts();
    }, []);

    if (error) {
        return (
            <section className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100 text-center">
                <h2 className="text-danger">Something went wrong, please reload the page</h2>
            </section>
        )
    }

    if (loading) {
        return (
            <section className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100 text-center">
                <Spinner color="primary" />
                <p>Loading...</p>
            </section>
        )
    }

    return (
        <AppContext.Provider value={{ contacts, setContacts }}>
            <Container>
                <Row className="mt-5">
                    <Col sm="12">
                        <Card>
                            <CardHeader className="d-flex justify-content-between gap-2 align-items-center">
                                <h2>Contacts</h2>
                                <Button size="sm" color="success" onClick={() => setShowModal(true)}>New contact</Button>
                            </CardHeader>
                            <CardBody>
                                <ContactsTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <NewContact open={showModal} onClose={() => setShowModal(false)} />
            </Container>
        </AppContext.Provider>
    )
}

export default App;