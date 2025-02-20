import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { fetchUsers, loginUser } from "../API";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserLogin from "../components/UserLogin";
import { UserAuthContext } from "../context/UserAuthContext";
import { MemoryRouter } from "react-router-dom";


jest.mock('../API', () => ({
    loginUser: jest.fn(),
    fetchUsers: jest.fn()
}));

const queryClient = new QueryClient();
const renderUsingClient = (ui) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </QueryClientProvider>
    );
};

describe('User Login Functionality', () => {
    test('Simulate a successful user login receiving a auth token', async () => {
        const mockCredentials = {
            username: 'test',
            password: 'goodPass'
        };
        const mockResponse = { token: 'goodLogin' };
        const mockUsers = [
            { username: 'test', id: 1 }
        ];

        //Mock a returned response from the Login
        loginUser.mockResolvedValueOnce(mockResponse);
        fetchUsers.mockResolvedValueOnce(mockUsers);
        
        //Mock UserAuthContext
        const mockLogin = jest.fn().mockImplementation((token, userInfo) => {
            console.log(`Mock login called with token: ${token}, user: ${JSON.stringify(userInfo)}`);
        });
        const mockUserAuthContext = {
            login: mockLogin,
        };

        renderUsingClient(
            <UserAuthContext.Provider value={mockUserAuthContext}>
                <UserLogin />
            </UserAuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });

        //Simulate User Input
        fireEvent.change(screen.getByTitle('enterUsername'), { target: { value: mockCredentials.username } });
        fireEvent.change(screen.getByTitle('enterPassword'), { target: { value: mockCredentials.password } });
        fireEvent.click(screen.getByTestId('login-button'));

        console.log('Mock Login Calls:', mockLogin.mock.calls);
        //Wait for output
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(mockResponse.token, { username: 'test', id: 1 });
            expect(screen.getByTestId('login-alert')).toBeInTheDocument();
        });
    });
})
