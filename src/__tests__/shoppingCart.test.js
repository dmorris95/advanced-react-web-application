import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Provider } from "react-redux";
import { configureStore, createReducer } from "@reduxjs/toolkit";
import ShoppingCart from "../components/ShoppingCart";
import ProductCatalog from "../components/ProductCatalog";
import { fetchProducts, fetchProductById } from "../API";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import cartReducer, { addItem } from "../features/cart/cartSlice";

//Build out a mock redux-store
const queryClient = new QueryClient();
const renderWithProviders = (ui, { reduxState = {} } = {}) => {
    const store = configureStore({
        reducer: {
            cart: cartReducer
        },
        preloadedState: reduxState
    });

    const rendered = render(
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    {ui}
                </MemoryRouter>
            </QueryClientProvider>
        </Provider>
    );
    return { ...rendered, store };
};

jest.mock('../API', () => ({
    __esModule: true,
    ...jest.requireActual('../API'),
    fetchProducts: jest.fn(),
    fetchProductById: jest.fn((id) => Promise.resolve({ 
        id, 
        title: `Test Product ${id}`, 
        price: id === 1 ? 5.00 : 10.00, 
    }))
}));

describe('Add Product to Cart', () => {
    test('add a product to cart and update ShoppingCart Component', async () => {
        const initialCart = {
            cart: {
                items: {},
                totalItems: 0
            }
        };
        const store = configureStore({
            reducer: {
                cart: cartReducer
            },
            preloadedState: initialCart
        });

        const mockResponse = [
            { id: 1, name: 'Test Product 1', price: 5.00, image: 'test-image-1.jpg', category: 'test'},
            { id: 2, name: 'Test Product 2', price: 10.00, image: 'test-image-2.jpg', category: 'test'}
        ];
        fetchProducts.mockResolvedValue(mockResponse);
        
        const { rerender } = renderWithProviders(
            <>
                <ProductCatalog />
            </>
        );

        //Make sure products are loaded in
        await waitFor(() => {
            expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Test Product 2/i)).toBeInTheDocument();
        });

        const addButton = screen.getAllByTestId('add-cart')[0]; //Get first instance
        fireEvent.click(addButton); //simulates the user interaction

        //Simulate the addItem action
        store.dispatch(addItem({ id: 1 }));

        //Trigger a rerender to simulate the state change and a navigate to the ShoppingCart
        rerender(
            <Provider store={store}> 
                <QueryClientProvider client={queryClient}> 
                    <MemoryRouter> 
                        <ShoppingCart /> 
                    </MemoryRouter> 
                </QueryClientProvider> 
            </Provider>
        );
        console.log(store.getState().cart);

        await waitFor(() => {
            expect(screen.getByTestId('product-quantity-display')).toBeInTheDocument();
        });
    });
})


