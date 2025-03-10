import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            loadingText: "Loading...",
            loginSuccess: "Login Successful!",
            userLoginText: "User Login",
            usernameText: "Username",
            usernameTitle: "Enter Username",
            validUsername: "Please enter a valid Username",
            passwordText: "Password",
            passwordTitle: "Enter Password",
            validPassword: "Please enter a valid password",
            loginText: "Login",
            createText: "Create New User",
            updateInfoText: "Update User Info",
            deleteText: "Delete User",
            returnHomeText: "Return to Home Page",
            returnLoginText: "Return to User Login",
            nameText: "Name:",
            firstNameText: "First Name",
            firstNameInput: "Enter your first name",
            validFirstName: "Please enter a valid first name",
            lastNameText: "Last Name",
            lastNameInput: "Enter your last name",
            validLastName: "Please enter a valid last name",
            emailText: "Email",
            emailInput: "Enter your email",
            validEmail: "Please enter a valid email address",
            phoneText: "Phone Number",
            phoneInput: "Enter phone number",
            validPhone: "Please enter a valid phone number",
            addressText: "Address:",
            streetText: "Street",
            streetInput: "Enter street",
            validStreet: "Please enter a valid street",
            houseText: "House/Apartment Number",
            houseInput: "Enter house/apartment number",
            validHouse: "Please enter a valid house/apartment number",
            cityText: "City",
            cityInput: "Enter City",
            validCity: "Please enter a valid city",
            zipText: "Zip Code",
            zipInput: "Enter Zip Code",
            validZip: "Please enter a valid zip code",
            latText: "Latitude",
            latInput: "Enter latitude",
            validLat: "Please enter a valid latitude",
            longText: "Longitude",
            longInput: "Enter longitude",
            validLong: "Please enter a valid longitude",
            submitText: "Submit",
            deleteModalText: "Are you sure you wish to delete this user from the database?",
            closeText: "Close",
            mustLoginText: "You must be logged in to view this page!",
            welcomeText: "Welcome ",
            cartItemText: "Your cart has ",
            itemsText: "items",
            checkOrderText: "Check Orders",
            logoutText: "Logout",
            filterText: "Filter",
            productNameSearch: "Search by Name",
            priceSearch: "Search by Price",
            priceText: "Price: $",
            addCartText: "Add to Cart",
            shoppingTitle: "Shopping Cart",
            cartQuantityText: "Quantity: ",
            totalItemText: "Total Items: ",
            totalPriceText: "Total Price: $",
            checkoutText: "Checkout",
            checkoutBody: "Successful Checkout! Your cart has been cleared!",
            checkoutSuccess: "Success",
            productIdText: "Product ID: ",
            dateText: "Date: ",
            orderIdText: "Order ID: ",
            productText: "Product: ",
            orderHistoryText: "Order History",
            cartDetailsText: "Cart Details for ID: ",
        },
    },
    pt: {
        translation: {
            loadingText: "Carregando...",
            loginSuccess: "Login bem-sucedido!",
            userLoginText: "Login do Usuário",
            usernameText: "Nome de usuário",
            usernameTitle: "Digite o nome de usuário",
            validUsername: "Por favor, insira um nome de usuário válido",
            passwordText: "Senha",
            passwordTitle: "Digite a senha",
            validPassword: "Por favor, insira uma senha válida",
            loginText: "Entrar",
            createText: "Criar Novo Usuário",
            updateInfoText: "Atualizar Informações do Usuário",
            deleteText: "Excluir Usuário",
            returnHomeText: "Voltar para a Página Inicial",
            returnLoginText: "Voltar para o Login do Usuário",
            nameText: "Nome:",
            firstNameText: "Primeiro Nome",
            firstNameInput: "Digite seu primeiro nome",
            validFirstName: "Por favor, insira um primeiro nome válido",
            lastNameText: "Sobrenome",
            lastNameInput: "Digite seu sobrenome",
            validLastName: "Por favor, insira um sobrenome válido",
            emailText: "Email",
            emailInput: "Digite seu email",
            validEmail: "Por favor, insira um endereço de email válido",
            phoneText: "Número de Telefone",
            phoneInput: "Digite o número de telefone",
            validPhone: "Por favor, insira um número de telefone válido",
            addressText: "Endereço:",
            streetText: "Rua",
            streetInput: "Digite a rua",
            validStreet: "Por favor, insira uma rua válida",
            houseText: "Número da Casa/Apartamento",
            houseInput: "Digite o número da casa/apartamento",
            validHouse: "Por favor, insira um número de casa/apartamento válido",
            cityText: "Cidade",
            cityInput: "Digite a cidade",
            validCity: "Por favor, insira uma cidade válida",
            zipText: "Código Postal",
            zipInput: "Digite o código postal",
            validZip: "Por favor, insira um código postal válido",
            latText: "Latitude",
            latInput: "Digite a latitude",
            validLat: "Por favor, insira uma latitude válida",
            longText: "Longitude",
            longInput: "Digite a longitude",
            validLong: "Por favor, insira uma longitude válida",
            submitText: "Enviar",
            deleteModalText: "Tem certeza de que deseja excluir este usuário do banco de dados?",
            closeText: "Fechar",
            mustLoginText: "Você deve estar logado para ver esta página!",
            welcomeText: "Bem-vindo ",
            cartItemText: "Seu carrinho tem ",
            itemsText: "itens",
            checkOrderText: "Verificar Pedidos",
            logoutText: "Sair",
            filterText: "Filtrar",
            productNameSearch: "Buscar por Nome",
            priceSearch: "Buscar por Preço",
            priceText: "Preço: $",
            addCartText: "Adicionar ao Carrinho",
            shoppingTitle: "Carrinho de Compras",
            cartQuantityText: "Quantidade: ",
            totalItemText: "Total de Itens: ",
            totalPriceText: "Preço Total: $",
            checkoutText: "Finalizar Compra",
            checkoutBody: "Compra Bem-Sucedida! Seu carrinho foi esvaziado!",
            checkoutSuccess: "Sucesso",
            productIdText: "ID do Produto: ",
            dateText: "Data: ",
            orderIdText: "ID do Pedido: ",
            productText: "Produto: ",
            orderHistoryText: "Histórico de Pedidos",
            cartDetailsText: "Detalhes do Carrinho para o ID: "
        }
    }

};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        keySeparator: false,
        interpolation: {
            escapeValue: false,
        },
    });

    export default i18n;