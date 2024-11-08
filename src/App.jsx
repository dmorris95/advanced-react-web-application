import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreateUser from "./components/CreateUser";
import UserLogin from "./components/UserLogin";
import HomePage from "./components/HomePage";
import ShoppingCart from "./components/ShoppingCart";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserAuthProvider } from "./context/UserAuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrderHistory from "./components/OrderHistory";
import { useTranslation } from "react-i18next";
import './i18n';
import { Container, Nav } from "react-bootstrap";

const queryClient = new QueryClient();

const App = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <UserAuthProvider>
        <Container>
          <Nav className='justify-content-center' as='nav' role='menubar'>
              <Nav.Link className='bg-secondary rounded-3 text-white m-2' onClick={() => changeLanguage('en')}>English</Nav.Link>
              <Nav.Link className='bg-secondary rounded-3 text-white m-2' onClick={() => changeLanguage('pt')}>Portugese</Nav.Link>
          </Nav>
          <Router>
            <Routes>  
              <Route path="/" element={<UserLogin />} />
              <Route path="/user-info" element={<CreateUser />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/orders" element={<OrderHistory />} />
            </Routes>
        </Router>
        </Container>
      </UserAuthProvider>
    </QueryClientProvider>
    
  );
}

export default App
