// Shopping Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// DOM elements
const cartContainer = document.getElementById('cartContainer');
const totalPriceElement = document.getElementById('totalPrice');
const checkoutButton = document.getElementById('checkoutButton');
const ordersContainer = document.getElementById('ordersContainer');
const totalAmountElement = document.getElementById('totalAmount');
// Event Listeners
checkoutButton.addEventListener('click', handleCheckout);

// Initialize
displayCart();
displayOrders();

// Event Listener
purchaseButton.addEventListener('click', purchaseItems);

// Functions

function displayCart() {
    cartContainer.innerHTML = '';
    let totalAmount = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(itemId => {
        const product = products.find(p => p.id === itemId);
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="removeFromCart(${product.id})">Remove</button>
        `;

        cartContainer.appendChild(cartItem);
        totalAmount += product.price;
    });

    totalAmountElement.textContent = totalAmount.toFixed(2);
}
    // cartContainer.innerHTML = '';

    // if (cart.length === 0) {
    //     cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    //     totalPriceElement.textContent = '';
    //     checkoutButton.disabled = true;
    //     return;
    // }

    // checkoutButton.disabled = false;

    // let totalPrice = 0;

    // cart.forEach(item => {
    //     const product = products.find(p => p.id === item.productId);
    //     totalPrice += product.price * item.quantity;

    //     const cartItem = document.createElement('div');
    //     cartItem.classList.add('cart-item');

    //     cartItem.innerHTML = `
    //         <h3>${item.name}</h3>
    //         <p>Price: $${item.price}</p>
    //         <p>id: ${item.id}</p>
    //         <button onclick="removeFromCart(${item.id})">Remove</button>
    //     `;

    //     cartContainer.appendChild(cartItem);
    // });

    // totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;


function removeFromCart(productId) {
    // cart = cart.filter(item => item.productId !== productId);
    // localStorage.setItem('cart', JSON.stringify(cart));
    // displayCart();
    cart = cart.filter(id => id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    alert('Product removed from cart.');
}

// function handleCheckout() {
//     if (cart.length === 0) {
//         alert('Your cart is empty.');
//         return;
//     }

//     const order = {
//         id: orders.length + 1,
//         items: cart,
//         date: new Date().toLocaleDateString(),
//         total: cart.reduce((sum, item) => sum + (products.find(p => p.id === item.productId).price * item.quantity), 0)
//     };

//     orders.push(order);
//     localStorage.setItem('orders', JSON.stringify(orders));

//     cart = [];
//     localStorage.setItem('cart', JSON.stringify(cart));

//     alert('Thank you for your purchase! Your order has been placed.');
//     displayCart();
//     displayOrders();
// }
function purchaseItems() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some products before purchasing.');
        return;
    }

    cart.forEach(itemId => {
        purchasedProducts.push(itemId);
    });

    localStorage.setItem('purchasedProducts', JSON.stringify(purchasedProducts));
    localStorage.removeItem('cart');
    cart = [];
    displayCartItems();
    displayPreviousOrders();
    alert('Thank you for your purchase!');
}


// function displayOrders() {
//     ordersContainer.innerHTML = '';

//     if (orders.length === 0) {
//         ordersContainer.innerHTML = '<p>You have no previous orders.</p>';
//         return;
//     }

//     orders.forEach(order => {
//         const orderElement = document.createElement('div');
//         orderElement.classList.add('order');

//         let itemsHtml = '';
//         order.items.forEach(item => {
//             const product = products.find(p => p.id === item.productId);
//             itemsHtml += `<p>${product.name} (x${item.quantity}) - $${product.price * item.quantity}</p>`;
//         });

//         orderElement.innerHTML = `
//             <h3>Order #${order.id} - ${order.date}</h3>
//             ${itemsHtml}
//             <p>Total: $${order.total.toFixed(2)}</p>
//         `;

//         ordersContainer.appendChild(orderElement);
//     });
// }
function displayPreviousOrders() {
    ordersContainer.innerHTML = '';

    if (purchasedProducts.length === 0) {
        ordersContainer.innerHTML = '<p>You have not made any purchases yet.</p>';
        return;
    }

    purchasedProducts.forEach(itemId => {
        const product = products.find(p => p.id === itemId);
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');

        orderItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Rating: ${product.rating} / 5</p>
        `;

        ordersContainer.appendChild(orderItem);
    });
}

//vash 
// API Place Order
function placeOrder() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No user logged in');
        window.location.href = 'login.html';
        return;
    }

    const products = getCartProducts(); // Assume this function retrieves the cart products
    const totalAmount = calculateTotal(products); // Assume this calculates total price

    fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products, totalAmount })
    })
    .then(response => response.json())
    .then(order => {
        alert('Order placed successfully!');
        clearCart(); // Assume this function clears the cart after order
    })
    .catch(error => console.error('Error placing order:', error));
}


const cartContainer = document.getElementById('cartContainer');
const totalAmountElem = document.getElementById('totalAmount');
const checkoutButton = document.getElementById('checkoutButton');

const userId = 'replace-with-logged-in-user-id';  // Manage user sessions properly

// Initialize
displayCart();

async function displayCart() {
    const response = await fetch(`/user/${userId}/cart`);
    const cart = await response.json();

    let totalAmount = 0;
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const product = item.productId;
        const productDiv = document.createElement('div');
        productDiv.classList.add('cart-item');

        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Quantity: ${item.quantity}</p>
        `;

        cartContainer.appendChild(productDiv);
        totalAmount += product.price * item.quantity;
    });

    totalAmountElem.innerText = totalAmount.toFixed(2);
}

checkoutButton.addEventListener('click', async () => {
    const response = await fetch(`/user/${userId}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount: parseFloat(totalAmountElem.innerText) })
    });

    if (response.ok) {
        alert('Order placed successfully!');
        displayCart();  // Refresh cart after checkout
    } else {
        alert('Failed to place order.');
    }
});

const ordersContainer = document.getElementById('ordersContainer');

const userId = 'replace-with-logged-in-user-id';  // Manage user sessions properly

// Initialize
displayOrders();

async function displayOrders() {
    const response = await fetch(`/user/${userId}/orders`);
    const orders = await response.json();

    ordersContainer.innerHTML = '';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order-item');

        let itemsHtml = '';
        order.items.forEach(item => {
            const product = item.productId;
            itemsHtml += `
                <div class="order-product">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${product.price}</p>
                </div>
            `;
        });

        orderDiv.innerHTML = `
            <h2>Order ID: ${order._id}</h2>
            <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
            <div class="order-products">
                ${itemsHtml}
            </div>
            <p>Total Amount: $${order.totalAmount}</p>
        `;

        ordersContainer.appendChild(orderDiv);
    });
}

//favourites

const favoritesContainer = document.getElementById('favoritesContainer');

const userId = 'replace-with-logged-in-user-id';  // Manage user sessions properly

// Initialize
displayFavorites();

async function displayFavorites() {
    const response = await fetch(`/user/${userId}/favorites`);
    const favorites = await response.json();

    favoritesContainer.innerHTML = '';

    favorites.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('favorite-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Rating: ${product.rating} / 5</p>
            <button onclick="removeFromFavorites('${product._id}')">Remove from Favorites</button>
        `;

        favoritesContainer.appendChild(productCard);
    });
}

async function removeFromFavorites(productId) {
    const response = await fetch(`/user/${userId}/favorites/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        alert('Product removed from favorites!');
        displayFavorites();  // Refresh favorites list after removal
    } else {
        alert('Failed to remove product from favorites.');
    }
}


