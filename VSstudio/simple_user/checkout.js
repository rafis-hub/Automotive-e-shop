// Shopping Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// DOM elements
const cartContainer = document.getElementById('cartContainer');
const totalPriceElement = document.getElementById('totalPrice');
const checkoutButton = document.getElementById('checkoutButton');
const ordersContainer = document.getElementById('ordersContainer');

// Event Listeners
checkoutButton.addEventListener('click', handleCheckout);

// Initialize
displayCart();
displayOrders();

// Functions

function displayCart() {
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceElement.textContent = '';
        checkoutButton.disabled = true;
        return;
    }

    checkoutButton.disabled = false;

    let totalPrice = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        totalPrice += product.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="removeFromCart(${product.id})">Remove</button>
        `;

        cartContainer.appendChild(cartItem);
    });

    totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const order = {
        id: orders.length + 1,
        items: cart,
        date: new Date().toLocaleDateString(),
        total: cart.reduce((sum, item) => sum + (products.find(p => p.id === item.productId).price * item.quantity), 0)
    };

    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Thank you for your purchase! Your order has been placed.');
    displayCart();
    displayOrders();
}

function displayOrders() {
    ordersContainer.innerHTML = '';

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>You have no previous orders.</p>';
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.classList.add('order');

        let itemsHtml = '';
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            itemsHtml += `<p>${product.name} (x${item.quantity}) - $${product.price * item.quantity}</p>`;
        });

        orderElement.innerHTML = `
            <h3>Order #${order.id} - ${order.date}</h3>
            ${itemsHtml}
            <p>Total: $${order.total.toFixed(2)}</p>
        `;

        ordersContainer.appendChild(orderElement);
    });
}
