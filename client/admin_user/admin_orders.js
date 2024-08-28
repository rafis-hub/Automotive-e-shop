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


//vash 

document.addEventListener('DOMContentLoaded', function() {
    const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];

    // Fetch and display orders
    fetch('http://localhost:3000/api/admin/orders', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
    })
    .then(response => response.json())
    .then(orders => {
        orders.forEach(order => {
            const row = ordersTable.insertRow();
            const productDetails = order.products.map(p => `${p.product.name} (x${p.quantity})`).join(', ');
            row.innerHTML = `
                <td>${order._id}</td>
                <td>${order.user.username}</td>
                <td>${productDetails}</td>
                <td>${order.totalPrice}</td>
                <td>${order.status}</td>
                <td>
                    <button onclick="updateOrderStatus('${order._id}', 'Shipped')">Mark as Shipped</button>
                    <button onclick="deleteOrder('${order._id}')">Delete</button>
                </td>
            `;
        });
    })
    .catch(error => console.error('Error fetching orders:', error));

    // Update order status
    window.updateOrderStatus = function(orderId, status) {
        fetch(`http://localhost:3000/api/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            },
            body: JSON.stringify({ status: status })
        })
        .then(response => response.json())
        .then(data => {
            alert('Order status updated successfully');
            location.reload();
        })
        .catch(error => console.error('Error updating order status:', error));
    };

    // Delete order
    window.deleteOrder = function(orderId) {
        if (confirm('Are you sure you want to delete this order?')) {
            fetch(`http://localhost:3000/api/admin/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
                }
            })
            .then(response => response.json())
            .then(data => {
                alert('Order deleted successfully');
                location.reload();
            })
            .catch(error => console.error('Error deleting order:', error));
        }
    };
});
