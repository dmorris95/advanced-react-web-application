import React from "react";
import { useEffect, useState } from "react";
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginUser, fetchUsers } from '../API';
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

const UserLogin = () => {
    const [userCred, setUserCred] = useState({
        username: '',
        password: ''
    });
    const { login } = useUserAuth();
    const navigate = useNavigate();
    const [errors, setErrors] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    useEffect (() => {
        const storedUser = sessionStorage.getItem('userData');
        if (storedUser) {
            navigate('/home');
        }
    }, [navigate]);

    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 10 * 60 * 1000, 
        cacheTime: 15 * 60 * 1000
    });

    const { mutate } = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            //Search User Query for matching credentials
            if (users) {
                const matchUser = users.find(user => user.username === userCred.username);
                if (matchUser) {
                    //Put successful login into sessionStorage
                    login(data.token, matchUser);
                    console.log('Login Successful');
                    setTimeout(() => setShowSuccessAlert(true), 1000);
                    //Navigate to Home Page
                    setTimeout(() => navigate('/home'), 3000);
                } else {
                    setErrors('User not found in existing users');
                }
            } else {
                setErrors('Users data is unavailable');
            }
        },
        onError: () => {
            setErrors('Error gathering Login: Invalid Credentials');
        },
    });

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setUserCred({...userCred, [name]: value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(userCred);
        setErrors('');
    };

    const handleCreate = () => {
        navigate('/user-info');
    }

    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hiddden">{t('loadingText')}</span></Spinner>;
    if (error) return <Alert variant="danger">{error.message}</Alert>;

    return (
    <section>
        {showSuccessAlert && <Alert variant="success" className="text-center">{t('loginSuccess')}</Alert>}
        <Container className="d-flex align-items-center justify-content-center">
        <Form onSubmit={handleSubmit} className="m-3 bg-light p-3">
            <h3 className="text-center display-5">{t('userLoginText')}</h3>
            <Form.Group controlId="usernameInput" className="mb-3">
                <Form.Label>{t('usernameText')}</Form.Label>
                <Form.Control type="text"
                    name="username" required
                    placeholder={t('usernameTitle')}
                    value={userCred.username}
                    onChange={handleChange}
                    aria-label={t('usernameTitle')}
                    aria-describedby="usernameHelpBlock"
                />
                <Form.Control.Feedback type="invalid" id="usernameHelpBlock">
                    {t('validUsername')}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="passwordInput" className="mb-3">
                <Form.Label>{t('passwordText')}</Form.Label>
                <Form.Control type="text"
                    name="password" required
                    placeholder={t('passwordTitle')}
                    value={userCred.password}
                    onChange={handleChange}
                    aria-label={t('passwordTitle')}
                    aria-describedby="passwordHelpBlock"
                />
                <Form.Control.Feedback type="invalid" id="passwordHelpBlock">
                    {t('validPassword')}
                </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-center">
            <Button type="submit" variant="success" className="m-1">
                {t('loginText')}
            </Button>
            <Button variant="info" className="m-1" onClick={handleCreate}>
                {t('createText')}
            </Button>
            </div>
        </Form>
        </Container>
        {errors && <Alert variant="danger" className="text-center">{errors}</Alert>}
    </section>
    )
};

export default UserLogin;