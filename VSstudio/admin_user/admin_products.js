// Check if admin is logged in
if (!localStorage.getItem('adminLoggedIn') && window.location.pathname !== '/admin_login.html') {
    window.location.href = 'admin_login.html';
}

// Admin login logic
const adminLoginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');

if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === adminCredentials.username && password === adminCredentials.password) {
            localStorage.setItem('adminLoggedIn', true);
            window.location.href = 'admin_index.html';
        } else {
            loginError.textContent = 'Invalid username or password.';
        }
    });
}

// Admin logout logic
const adminLogoutLink = document.getElementById('adminLogoutLink');
if (adminLogoutLink) {
    adminLogoutLink.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin_login.html';
    });
}

// Dummy data for users and products
let users = JSON.parse(localStorage.getItem('users')) || [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 10.00 },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 20.00 }
];

// DOM elements for users management
const usersTableBody = document.querySelector('#usersTable tbody');

// Initialize Users List
displayUsers();

function displayUsers() {
    usersTableBody.innerHTML = '';

    users.forEach(user => {
        const userRow = document.createElement('tr');

        userRow.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;

        usersTableBody.appendChild(userRow);
    });
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    const newName = prompt('Enter new name:', user.name);
    const newEmail = prompt('Enter new email:', user.email);

    if (newName && newEmail) {
        user.name = newName;
        user.email = newEmail;
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
    }
}

// DOM elements for products management
const productsTableBody = document.querySelector('#productsTable tbody');
const addProductForm = document.getElementById('addProductForm');

// Initialize Products List
displayProducts();

function displayProducts() {
    productsTableBody.innerHTML = '';

    products.forEach(product => {
        const productRow = document.createElement('tr');

        productRow.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;

        productsTableBody.appendChild(productRow);
    });
}

function addProduct(name, description, price) {
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        name,
        description,
        price: parseFloat(price)
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    const newName = prompt('Enter new name:', product.name);
    const newDescription = prompt('Enter new description:', product.description);
    const newPrice = prompt('Enter new price:', product.price);

    if (newName && newDescription && newPrice) {
        product.name = newName;
        product.description = newDescription;
        product.price = parseFloat(newPrice);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
    }
}

// Handle product form submission
if (addProductForm) {
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const price = document.getElementById('productPrice').value;

        if (name && description && price) {
            addProduct(name, description, price);
            addProductForm.reset();
        }
    });
}
