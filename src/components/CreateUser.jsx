import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Modal, Alert, Spinner } from "react-bootstrap";
import { createNewUser, deleteUser, updateUser } from "../API";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

const CreateUser = () => {
    const queryClient = useQueryClient();
    const [existFlag, setExistFlag] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { logout, updateName } = useUserAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        id: sessionStorage.getItem('userData.id') || '',
        email: '',
        username: '',
        password: '',
        name: {
            firstname: '',
            lastname: ''
        },
        address: {
            city: '',
            street: '',
            number: '',
            zipcode: '',
            geolocation:{
                lat: '',
                long: ''
            },
        },
        phone: ''
    });


    useEffect(() => {
        const existUser = JSON.parse(sessionStorage.getItem('userData'));
        if (existUser) {
            setUserData(existUser);
            setExistFlag(true);
        }
    }, []);

    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: existFlag ? updateUser : createNewUser,
        onSuccess: (data) => {
            if (existFlag) {
                console.log('User updated successfully');
                
                queryClient.setQueryData(['users'], (existingUsers) => {
                    console.log(existingUsers);
                    return existingUsers.map((user) => user.id === userData.id ? data : user);
                });
                //Update session storage with updated data
                sessionStorage.setItem('userData', JSON.stringify(userData));
                console.log('Successful query update');
                updateName(userData.name.firstname);
                //Navigate to Home Page
                navigate('/home');

            } else {
                console.log('User successfully created.')
                queryClient.setQueryData(['users'], (existingUsers) => [...existingUsers, data]);
                //Navigate back to Login Page
                navigate('/');
            }
        }
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevInfo) => {
            if (name.includes('.')) {
                const updatedData = setNestedValue({ ...prevInfo }, name, value);
                return updatedData;
            } else {
                return { ...prevInfo, [name]: value};
            }
        });
    };

    // function to dig into the userData properties and properly assign values
    const setNestedValue = (prevInfo, name, value) => {
        const keys = name.split('.'); //['name'], ['firstname']
        const lastKey = keys.pop();
        const deepRef = keys.reduce((acc, key) => acc[key], prevInfo);
        deepRef[lastKey] = value; // sets the last key to the value therefore updating the appropriate field
        return { ...prevInfo };
      };
    
    const delUser = useMutation({
        mutationFn: deleteUser,
        onSuccess: (data) => {
            console.log('User deleted successfully')
            //Remove from stored Query
            queryClient.setQueryData(['users'], (existingUsers) => {
                return existingUsers.filter(user => user.id !== userData.id);
            });
            setShowDeleteModal(false);
            //Remove from sessionstorage
            logout();
            //Navigate back to Login Page
            navigate('/');
        },
    });
    
    const handleClose = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = () => {
        //Run Delete Mutation
        delUser.mutate(userData.id);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(userData);
    };
    
    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hiddden">{t('loadingText')}</span></Spinner>;
    if (isError) return <Alert variant="danger">{error.message}</Alert>;

    return(
        <Container className="vh-100">
            <Row className="d-flex justify-content-center align-items-center h-100">
            <Col>
                <h3 className="text-center display-4">{existFlag ? t('updateInfoText') : t('createText')}</h3>
                {existFlag &&
                <Container>
                    <Row className="align-items-center justify-content-center">
                    <Button variant="danger" style={{width: '20%'}} className="mb-3 rounded-3" onClick={() => {setShowDeleteModal(true)}} >
                        {t('deleteText')}
                    </Button> 
                    </Row>
                    <Row>
                        <p className="text-center" onClick={(e) => {navigate('/home')}} style={{ cursor: 'pointer'}}>
                            {t('returnHomeText')}
                        </p>
                    </Row>
                </Container>
                }
                {!existFlag && 
                    <p className="text-center" onClick={(e) => {navigate('/')}} style={{ cursor: 'pointer'}}>
                        {t('returnLoginText')}
                    </p>
                }
                
                <Form onSubmit={handleSubmit} className="bg-secondary-subtle p-3 rounded-3">
                    <Row className="mb-3 border">
                        <h5>{t('nameText')}</h5>
                        <Form.Group as={Col} controlId="firstNameInput" className="mb-3">
                            <Form.Label>{t('firstNameText')}</Form.Label>
                            <Form.Control type="text"
                            name="name.firstname" required
                            placeholder={t('firstNameInput')} 
                            value={userData.name.firstname} 
                            onChange={handleChange} 
                            aria-label={t('firstNameInput')}
                            aria-describedby="firstHelpBlock"
                            />
                            <Form.Control.Feedback type="invalid" id="firstHelpBlock">
                                {t('validFirstName')}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="lastNameInput" className="mb-3">
                            <Form.Label>{t('lastNameText')}</Form.Label>
                            <Form.Control type="text"
                            name="name.lastname" required
                            placeholder={t('lastNameInput')}
                            value={userData.name.lastname}
                            onChange={handleChange}
                            aria-label={t('lastNameInput')}
                            aria-describedby="lastHelpBlock"
                            />
                        </Form.Group>
                        <Form.Control.Feedback type="invalid" id="lastHelpBlock">
                            {t('validLastName')}
                        </Form.Control.Feedback>
                    </Row>
                    <Row className="border">
                        <Form.Group as={Col} controlId="usernameInput" className="mb-3">
                            <Form.Label>{t('usernameText')}</Form.Label>
                            <Form.Control type="text"
                            name="username" required
                            placeholder={t('usernameTitle')}
                            value={userData.username} 
                            onChange={handleChange}
                            aria-label={t('usernameTitle')}
                            aria-describedby="usernameHelpBlock"
                            />
                            <Form.Control.Feedback type="invalid" id="usernameHelpBlock">
                                {t('validUsername')}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="passwordInput" className="mb-3">
                            <Form.Label>{t('passwordText')}</Form.Label>
                            <Form.Control type="text"
                            name="password" required
                            placeholder={t('passwordTitle')}
                            value={userData.password}
                            onChange={handleChange}
                            aria-label={t('passwordTitle')}
                            aria-describedby="passwordHelpBlock"
                            />
                            <Form.Control.Feedback type="invalid" id="passwordHelpBlock">
                                {t('validPassword')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="my-3">
                        <Form.Group as={Col} controlId="emailInput" className="mb-3">
                            <Form.Label>{t('emailText')}</Form.Label>
                            <Form.Control type="text"
                            name="email" required
                            placeholder={t('emailInput')}
                            value={userData.email} 
                            onChange={handleChange} 
                            aria-label={t('emailInput')}
                            aria-describedby="emailHelpBlock"
                            />
                            <Form.Control.Feedback type="invalid" id="emailHelpBlock">
                                {t('validEmail')}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} controlId="phoneInput" className="mb-3">
                            <Form.Label>{t('phoneText')}</Form.Label>
                            <Form.Control type="text"
                            name="phone" required
                            placeholder={t('phoneInput')}
                            value={userData.phone}
                            onChange={handleChange}
                            aria-label={t('phoneInput')}
                            aria-describedby="phoneHelpBlock"
                            />
                            <Form.Control.Feedback type="invalid" id="phoneHelpBlock">
                                {t('validPhone')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Container className="border">
                        <h5>{t('addressText')}</h5>
                        <Row className="my-1">
                            <Form.Group as={Col} controlId="streetInput" className="mb-3">
                                <Form.Label>{t('streetText')}</Form.Label>
                                <Form.Control type="text"
                                name="address.street" required
                                placeholder={t('streetInput')} 
                                value={userData.address.street} 
                                onChange={handleChange} 
                                aria-label={t('streetInput')}
                                aria-describedby="streetHelpBlock"
                                />
                                <Form.Control.Feedback type="invalid" id="streetHelpBlock">
                                    {t('validStreet')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} controlId="zipCodeInput" className="mb-3">
                                <Form.Label>{t('houseText')}</Form.Label>
                                <Form.Control type="text"
                                name="address.number" required
                                placeholder={t('houseInput')}
                                value={userData.address.number}
                                onChange={handleChange}
                                aria-label={t('houseInput')}
                                aria-describedby="houseHelpBlock"
                                />
                                <Form.Control.Feedback type="invalid" id="houseHelpBlock">
                                    {t('validHouse')}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="my-1">
                            <Form.Group as={Col} controlId="cityInput" className="mb-3">
                                <Form.Label>{t('cityText')}</Form.Label>
                                <Form.Control type="text" 
                                name="address.city" required
                                placeholder={t('cityInput')}
                                value={userData.address.city} 
                                onChange={handleChange} 
                                aria-label={t('cityInput')}
                                aria-describedby="cityHelpBlock"
                                />
                                <Form.Control.Feedback type="invalid" id="cityHelpBlock">
                                    {t('validCity')}
                                </Form.Control.Feedback>
                             </Form.Group>
                            <Form.Group as={Col} controlId="zipCodeInput" className="mb-3">
                                <Form.Label>{t('zipText')}</Form.Label>
                                <Form.Control type="text"
                                name="address.zipcode" required
                                placeholder={t('zipInput')}
                                value={userData.address.zipcode}
                                onChange={handleChange}
                                aria-label={t('zipInput')}
                                aria-describedby="zipHelpBlock"
                                />
                                <Form.Control.Feedback type="invalid" id="zipHelpBlock">
                                    {t('validZip')}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="my-1">
                            <Form.Group as={Col} controlId="latInput" className="mb-3">
                                <Form.Label>{t('latText')}</Form.Label>
                                <Form.Control type="text" 
                                name="address.geolocation.lat" required
                                placeholder={t('latInput')}
                                value={userData.address.geolocation.lat} 
                                onChange={handleChange} 
                                aria-label={t('latInput')}
                                aria-describedby="latHelpBlock"
                                />
                                <Form.Control.Feedback type="invalid" id="latHelpBlock">
                                    {t('validLat')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} controlId="longInput" className="mb-3">
                                <Form.Label>{t('longText')}</Form.Label>
                                <Form.Control type="text"
                                name="address.geolocation.long" required
                                placeholder={t('longInput')}
                                value={userData.address.geolocation.long}
                                onChange={handleChange}
                                aria-label={t('longInput')}
                                aria-describedby="longHelpBlock"
                                />
                                <Form.Control.Feedback type="invalid" id="longHelpBlock">
                                    {t('validLong')}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Button type="submit" variant="success" className="m-3 d-flex justify-content-center">
                            {t('submitText')}
                        </Button>
                    </Container>
                </Form>
            </Col>
            </Row>
            <Modal show={showDeleteModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('deleteText')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {t('deleteModalText')}<br/>
                    <Button variant="danger" size="sm" onClick={handleDelete}>
                        {t('deleteText')}
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleClose}>
                        {t('closeText')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
};

export default CreateUser;