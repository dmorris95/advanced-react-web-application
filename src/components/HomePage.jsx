import { useSelector } from "react-redux";
import { useUserAuth } from "../context/UserAuthContext";
import { Container, Button } from "react-bootstrap";
import ProductCatalog from "./ProductCatalog";
import { useNavigate, NavLink } from "react-router-dom";
import { t } from "i18next";


function HomePage() {
    const { userFirst, logout } = useUserAuth();
    const navigate = useNavigate();
    const cartCount = useSelector((state) => state.cart.totalItems);
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    //Check if User is logged in
    if (!userFirst) {
        return (
            <Container className="mt-5 text-center">
                <p>{t('mustLoginText')}</p>
                <Button onClick={() => navigate('/')}>{t('returnLoginText')}</Button>
            </Container>
        )
    }

    return (
        <Container>
            <header className="d-flex justify-content-between">
                <h3 className="mt-3">{t('welcomeText')}{userFirst}</h3>
                <NavLink to='/user-info' className="mt-3 mb-3 bg-secondary-subtle p-1 rounded-3">{t('updateInfoText')}</NavLink>
                <NavLink to='/cart' className="mt-3 mb-3 bg-secondary-subtle p-1 rounded-3">{t('cartItemText')} {cartCount} {t('itemsText')}</NavLink>
                <NavLink to='/orders' className="mt-3 mb-3 bg-secondary-subtle p-1 rounded-3">{t('checkOrderText')}</NavLink>
                <Button onClick={handleLogout} style={{ width: '70px'}} variant="danger" className="me-5 my-3">
                    {t('logoutText')}
                </Button> 
            </header>
            <ProductCatalog />
        </Container>
    )
};

export default HomePage;