import React, { createContext, useContext, useEffect, useState } from "react";

const UserAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userFirst, setUserFirst] = useState(null);

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('authToken'));
        const userInfo = JSON.parse(sessionStorage.getItem('userData'));

        if (token && userInfo) {
            setAuthToken(token);
            setUserData(userInfo);
            setUserFirst(userInfo.name.firstname);
        }
    }, []);

    const login = (token, userInfo) => {
        sessionStorage.setItem('authToken', JSON.stringify(token));
        sessionStorage.setItem('userData', JSON.stringify(userInfo));
        setAuthToken(token);
        setUserData(userInfo);
        setUserFirst(userInfo.name.firstname);
    };

    const logout = () => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('cartItems');
        setAuthToken(null);
        setUserData(null);
        setUserFirst(null);
    };

    const updateName = (firstname) => {
        setUserFirst(firstname);
        setUserData((prevData) => ({
            ...prevData,
            name: {
                ...prevData.name,
                firstname: firstname,
            },
        }));
    };

    return (
        <UserAuthContext.Provider value={{ authToken, userData, userFirst, login, logout, updateName }}>
            {children}
        </UserAuthContext.Provider>
    );

};

export { UserAuthContext };

export const useUserAuth = () => useContext(UserAuthContext);