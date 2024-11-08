import React from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, Spinner, Row, Col, Container, Navbar, Nav, Form } from "react-bootstrap";
import { fetchProducts } from "../API";
import { useMemo, useState } from "react";
import { addItem } from "../features/cart/cartSlice";
import { t } from 'i18next'

const ProductCatalog = () => {
    const dispatch = useDispatch();

    const [selectCat, setSelectCat] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchPrice, setSearchPrice] = useState('');

    const categories = [
        "Electronics",
        "Jewelery",
        "Men's Clothing",
        "Women's Clothing"
        ];
    
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3, // retry failed queries up to 3 times
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000, // data is fresh for 5 minutes
        cahceTime: 15 * 60 * 1000 // Data is cached for 15 minutes after query
    });

    const handleAddToCart = (prodId) => {
        console.log(`Adding product with ID: ${prodId}`);
        dispatch(addItem({ id: prodId }));
    };

    const handleFilterChange = (cat) => {
        if (selectCat === cat) {
            setSelectCat('');
        } else {
            setSelectCat(cat);
        }
    };

    //Memoized Filter to filter by any number of the criteria at a given time
    const filterProducts = useMemo(() => { 
        return products ? products.filter(product => {
            const matchCat = product.category.includes(selectCat.toLowerCase());
            const matchName = searchName === '' || product.title.toLowerCase().includes(searchName.toLowerCase());
            const matchPrice = searchPrice === '' || product.price.toString().includes(searchPrice);
            return matchCat && matchName && matchPrice;
        }) : [];
    }, [products, selectCat, searchName, searchPrice]);

    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hiddden">{t('loadingText')}</span></Spinner>;
    if (error) return <Alert variant="danger">{error.message}</Alert>;

    return (
        <Container>            
            <Navbar className="bg-info-subtle p-1 mb-1 rounded-2">
                <Navbar.Brand>{t('filterText')}</Navbar.Brand>
                <Navbar.Toggle aria-controls="filter-navbar" />
                <Navbar.Collapse id="filter-navbar">
                    <Nav className="me-auto d-flex align-items-center">
                        {categories.map((category, ind) => (
                            <Nav.Link key={ind}
                                active={selectCat === category}
                                onClick={() => handleFilterChange(category)}
                                >
                                    {category}
                                </Nav.Link>
                        ))}
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="text"
                            placeholder={t('productNameSearch')}
                            className="me-2"
                            aria-label={t('productNameSearch')}
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            />
                        <Form.Control
                            type="text"
                            placeholder={t('priceSearch')}
                            className="me-2"
                            aria-label={t('priceSearch')}
                            value={searchPrice}
                            onChange={(e) => setSearchPrice(e.target.value)}
                            />
                    </Form>
                </Navbar.Collapse>
            </Navbar>
            <Row xs={1} md={4} className="g-4">
                {filterProducts.map(product => (
                    <Col key={product.id}>
                        <Card style={{width: '12rem' }}>
                            <div style={{ padding: '10px' }}>
                                <Card.Img variant="top" src={product.image} style={{ height: '125px', objectFit: 'contain'}} />
                            </div>
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>
                                    {t('priceText')}{product.price}
                                </Card.Text>
                                <Button variant="primary" onClick={() => handleAddToCart(product.id)}>{t('addCartText')}</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ProductCatalog;
