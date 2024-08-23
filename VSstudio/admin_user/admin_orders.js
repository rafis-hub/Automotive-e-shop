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

// Dummy data for users, products, and orders
let users = JSON.parse(localStorage.getItem('users')) || [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 10.00 },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 20.00 }
];

let orders = JSON.parse(localStorage.getItem('orders')) || [
    { id: 1, userId: 1, products: [1, 2], totalAmount: 30.00, status: 'Pending' },
    { id: 2, userId: 2, products: [2], totalAmount: 20.00, status: 'Processed' }
];

// DOM elements for orders management
const ordersTableBody = document.querySelector('#ordersTable tbody');

// Initialize Orders List
displayOrders();

function displayOrders() {
    ordersTableBody.innerHTML = '';

    orders.forEach(order => {
        const user = users.find(u => u.id === order.userId);
        const orderRow = document.createElement('tr');

        orderRow.innerHTML = `
            <td>${order.id}</td>
            <td>${user.name}</td>
            <td>$${order.totalAmount.toFixed(2)}</td>
            <td>${order.status}</td>
            <td>
                <button onclick="viewOrder(${order.id})">View</button>
                <button onclick="markAsProcessed(${order.id})">Mark as Processed</button>
                <button onclick="deleteOrder(${order.id})">Delete</button>
            </td>
        `;

        ordersTableBody.appendChild(orderRow);
    });
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    const user = users.find(u => u.id === order.userId);
    const productNames = order.products.map(productId => {
        const product = products.find(p => p.id === productId);
        return product.name;
    }).join(', ');

    alert(`Order ID: ${order.id}\nUser: ${user.name}\nProducts: ${productNames}\nTotal Amount: $${order.totalAmount.toFixed(2)}\nStatus: ${order.status}`);
}

function markAsProcessed(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order.status !== 'Processed') {
        order.status = 'Processed';
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
    }
}

function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
    }
}
