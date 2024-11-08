The Advanced React E-Commerce Web Application

This application uses the fakestoreapi to populate the application with simulated information using API calls to the web server. This application features internationalization with being able to switch between English and Portugese with the click of a button at the top of the screen. This application uses QueryClient and Redux to help maintain different parts of the application with Redux being used to maintain a logged in user's shopping cart. This application showcases testing within the User Login(Testing a successful Login) and the Product Catalog to Shopping Cart pages(Testing a product being added to the cart).

- User Login
    - The User Login page simulates a users login by checking username and password combinations against the API's database of mock user profiles. Providing error messages for an invalid login or nonexistant user. A successful login transfers the user to the home page which displays a list of options and the Product Catalog. Successful Login will store the user's information in sessionStorage

    * A created user through the application will not be able to login as the API does not allow for the addition of data to the server so an authentication token can not be retrieved.

- Create User / Update User
    - The Create User page allows for new users to be created and mocked into the database. The API does not actually accept changes to the database so a created user is stored in the Users Query. The Create User page can also be used to update an existing users information once a user has logged in. If an existing user is logged in it also will give the option to delete the User from the database.

- Home Page
    - The Home Page is only accessible once a user has successfully logged in. It provides access to existing orders for the user and allows the user to view what they have added to their cart. They also have the option to update their information if they choose. A user can logout at any time from the home page by clicking the Logout button which will clear the sessionStorage and return them to the login page.

- Product Catalog
    - The Product Catalog showcases products retrieved from the API with the ability to add products to a users cart with the click of a button. The Catalog offers searching for products by price and or name. There is also an option for filtering products based on category.

 - Shopping Cart
    - The Shopping Cart is where all added products from the catalog are shown. A user can add or remove items with simple button clicks. The page shows total number of items and the total price of the cart. Clicking checkout will provide feedback that the cart has been cleared and the order has been placed.

- Order History
    - The Order History page lists an existing user's existing orders from a call to the API. Clicking an order gives more information on the products and pricing within the order.