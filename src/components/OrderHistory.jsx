import { useState, useEffect } from "react";
import { fetchOrders, fetchProductById } from "../API";
import { ListGroup, Alert, Modal, Button, Spinner } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { t } from "i18next";

const OrderHistory = () => {
    const storedUser = JSON.parse(sessionStorage.getItem('userData'));
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCart, setSelectedCart] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const data = await fetchOrders(storedUser.id);
                setOrders(data);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchOrderHistory();
    }, [storedUser.id]);

    const handleCartClick = async (order) => {
        setIsLoading(true);
        const cartDetails = await Promise.all(order.products.map(async (product) => {
            const productDetails = await fetchProductById(product.productId);
            return {...product, ...productDetails,};
        }));
        setOrderDetails({ ...order, products: cartDetails });
        setSelectedCart(true);
        setIsLoading(false);
    }

    const handleCloseModal = () => {
        setSelectedCart(null);
    };

    if (error) return <Alert variant="danger">{error.message}</Alert>;
    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hidden">{t('loadingText')}</span></Spinner>;

    return (
        <div>
            <h2>{t('orderHistoryText')}</h2>
            <NavLink to="/home" className="mt-3 mb-3 bg-secondary-subtle p-1 rounded-3">{t('returnHomeText')}</NavLink>
            <ListGroup className="mt-2"> 
                {orders.map(order => ( 
                    <ListGroup.Item className="mt-1" key={order.id} onClick={() => handleCartClick(order)}> 
                    <div className="bg-primary-subtle p-3 rounded"> 
                        <h5>{t('orderIdText')}{order.id}</h5> 
                        <p>{t('dateText')}{new Date(order.date).toLocaleDateString()}</p> 
                        <p>{t('productText')}{order.products.length}</p> 
                    </div> 
                    </ListGroup.Item> ))} 
            </ListGroup>

            {selectedCart && (
                <Modal show onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('cartDetailsText')}{orderDetails.id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{t('dateText')}{new Date(orderDetails.date).toLocaleDateString()}</p>
                        <ListGroup>
                            {orderDetails.products.map(product => (
                                <ListGroup.Item key={product.id}>
                                    <div>
                                        <p>{t('productIdText')}{product.id}</p>
                                        <p>{t('cartQuantityText')}{product.quantity}</p>
                                        <p>{t('priceText')}{product.price.toFixed(2)}</p>
                                        <p>{t('totalPriceText')}{(product.price * product.quantity).toFixed(2)}</p>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <p>{t('totalPriceText')}{orderDetails.products.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>{t('closeText')}</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    )
};

export default OrderHistory;