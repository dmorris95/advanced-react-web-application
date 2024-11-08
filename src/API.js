const storeApiUrl = 'https://fakestoreapi.com';

export const createNewUser = async (user) => {
    const response = await fetch(`${storeApiUrl}/users`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: user.email,
            username: user.username,
            password: user.password,
            name:{
                firstname: user.firstname,
                lastname: user.lastname
            },
            address:{
                city: user.city,
                street: user.street,
                number: user.number,
                zipcode: user.zipcode,
                geolocation:{
                    lat: user.lat,
                    long: user.long
                }
            },
            phone: user.phone
        })
    });
    
    if (!response.ok) {
        throw new Error('Failed to add user')
    }
    //Returns a new userId
    return response.json();
};

export const loginUser = async (userCred) => {
    const response = await fetch(`${storeApiUrl}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: userCred.username,
            password: userCred.password
        })
    });
    if (!response.ok) {
        throw new Error('Failed to login')
    }
    //Returns a auth token
    const token = await response.json();

    return {token};
};

export const fetchUsers = async () => {
    const response = await fetch(`${storeApiUrl}/users`);
    if (!response.ok) {
        throw new Error('Network response was not good');
    }
    return response.json();
};

export const updateUser = async (user) => {
    const response = await fetch(`${storeApiUrl}/users/${user.id}`,{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: user.email,
            username: user.username,
            password: user.password,
            name:{
                firstname: user.firstname,
                lastname: user.lastname
            },
            address:{
                city: user.city,
                street: user.street,
                number: user.number,
                zipcode: user.zipcode,
                geolocation:{
                    lat: user.lat,
                    long: user.long
                }
            },
            phone: user.phone
        })
    });
    if (!response.ok) {
        throw new Error('Failed to update user')
    }
    return response.json();
};

export const deleteUser = async (userId) => {
    try { 
        const response = await fetch(`${storeApiUrl}/users/${userId}`, {
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' } 
        }); 
        if (!response.ok) {
             const errorData = await response.json(); 
             console.error('API delete error details:', errorData); 
             throw new Error(`Failed to delete user: ${response.statusText}`); 
            } 
        return response.json(); 
    } catch (error) {
        console.error('API delete error:', error); 
        throw error; 
    }
};

// PRODUCTS

export const fetchProducts = async () => {
    const response = await fetch(`${storeApiUrl}/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    return products;
};

export const fetchProductById = async (id) => {
    const response = await fetch(`${storeApiUrl}/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    const details = await response.json();
    return details;

};

// ORDER HISTORY

export const fetchOrders = async (userId) => {
    const response = await fetch(`${storeApiUrl}/carts/user/${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch users order history');
    }
    const orders = await response.json();
    return orders;
};