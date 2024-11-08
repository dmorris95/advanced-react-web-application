import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem, checkout } from "../features/cart/cartSlice";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { useQueries } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProductById } from "../API";
import { t } from "i18next";

const ShoppingCart = () => {
    const cart = useSelector((state) => state.cart);
    const cartItemIds = Object.keys(cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [cartEmpty, setCartEmpty] = useState(true);

    const handleAddItem = useCallback((id) => dispatch(addItem({ id })), [dispatch]);
    const handleRemoveItem = useCallback((id) => dispatch(removeItem({ id })), [dispatch]);
    
    const handleCheckout = useCallback(() => {
        dispatch(checkout()), [dispatch];
        setShowSuccessModal(true);
    });

    useEffect(() => {
        sessionStorage.setItem('cartItems', JSON.stringify(cart.items));
        if (cartItemIds.length > 0) {
            setCartEmpty(false);
        } else {
            setCartEmpty(true);
        }
    }, [cart.items]);

    const productQueries = useQueries({
        queries: cartItemIds.map(id => ({
            queryKey: ['product', id],
            queryFn: () => fetchProductById(id)
        }))
    });

    // function to get product by name
    const getProductName = useCallback((id) => {
        const index = cartItemIds.findIndex(itemId => itemId == id);
        const productQuery = productQueries[index];
        return productQuery?.data?.title || ' Unknown product';
    }, [productQueries, cartItemIds]);

    //Memoizing product names
    const productNames = useMemo(() =>
        cartItemIds.reduce((acc, id) => ({
            ...acc,
            [id]: getProductName(id)
        }), {}),
    [cartItemIds, getProductName]);

    const totalPrice = useMemo(() => {
        return cartItemIds.reduce((total, id) => {
            //find proper product using product query
            const index = cartItemIds.findIndex(itemId => itemId === id);
            const productQuery = productQueries[index];

            //check if product data is loaded
            if (productQuery.isSuccess && productQuery.data) {
                // accumulate total
                const productPrice = productQuery.data.price;
                const quantity = cart.items[id];
                return total + (productPrice * quantity);
            }
            return total;
        }, 0);
    }, [cart.items, cartItemIds, productQueries]);

    const handleCheckoutModal = () => {
        setShowSuccessModal(false);
        //Navigate back to home page
        navigate('/home')
    };

    return (
        <div>
            <h2>{t('shoppingTitle')}</h2>
            <ListGroup>
                {Object.entries(cart.items).map(([id, quantity]) => (
                    <ListGroup.Item key={id} className="d-flex justify-content-between align-items-center">
                        <span>{productNames[id]}  - {t('cartQuantityText')} {quantity}</span>
                        <div>
                            <Button variant="success" className="mx-1" onClick={() => handleAddItem(id)}>+</Button>
                            <Button variant="danger" onClick={() => handleRemoveItem(id)}>-</Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <p>{t('totalItemText')}{cart.totalItems}</p>
            <p>{t('totalPriceText')} {totalPrice.toFixed(2)}</p>
            <Button variant="success" disabled={cartEmpty} onClick={handleCheckout}>{t('checkoutText')}</Button>
            <Link to="/home">
                <Button variant="primary" className="ms-2">{t('returnHomeText')}</Button>
            </Link>

            {showSuccessModal && (
                <Modal show onHide={handleCheckoutModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('checkoutSuccess')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h3>{t('checkoutBody')}</h3>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleCheckoutModal}>{t('closeText')}</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ShoppingCart;