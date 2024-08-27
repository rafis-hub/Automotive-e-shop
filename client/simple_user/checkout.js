// checkout.js

document.addEventListener('DOMContentLoaded', loadCartAndOrders);

const cartContainer = document.getElementById('cartContainer');
const totalAmount = document.getElementById('totalAmount');
const ordersContainer = document.getElementById('ordersContainer');
const purchaseButton = document.getElementById('purchaseButton');

// Load cart items and previous orders
function loadCartAndOrders() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You are not logged in. Please log in first.');
        window.location.href = 'index.html';
        return;
    }

    // Fetch cart items
    fetch('http://localhost:3000/api/cart', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            displayCart(data.cartItems);
            updateTotalAmount(data.cartItems);
        }
    })
    .catch(error => console.error('Error:', error));

    // Fetch previous orders
    fetch('http://localhost:3000/api/orders', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            displayOrders(data.orders);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Display cart items
function displayCart(cartItems) {
    cartContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <p>${item.productName}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price}</p>
        `;
        cartContainer.appendChild(itemElement);
    });
}

// Update the total amount
function updateTotalAmount(cartItems) {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = total.toFixed(2);
}

// Display previous orders
function displayOrders(orders) {
    ordersContainer.innerHTML = '';

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>You have no previous orders.</p>';
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.innerHTML = `
            <h4>Order ID: ${order._id}</h4>
            <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <h5>Items:</h5>
            <ul>
                ${order.items.map(item => `<li>${item.productName} (x${item.quantity}) - $${item.price}</li>`).join('')}
            </ul>
        `;
        ordersContainer.appendChild(orderElement);
    });
}

// Handle purchase
purchaseButton.addEventListener('click', () => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Purchase successful!');
            loadCartAndOrders(); // Reload cart and orders after purchase
        }
    })
    .catch(error => console.error('Error:', error));
});

function logout() {
    localStorage.removeItem('token');
    alert('Logout successful!');
    window.location.href = 'index.html';
}
