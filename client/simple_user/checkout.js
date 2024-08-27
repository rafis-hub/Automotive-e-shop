const cartContainer = document.getElementById('cartContainer');
const totalPriceElement = document.getElementById('totalPrice');
const checkoutButton = document.getElementById('checkoutButton');
const ordersContainer = document.getElementById('ordersContainer');
const totalAmountElement = document.getElementById('totalAmount');


purchaseButton.addEventListener('click', purchaseItems);

//vash 
// API Place Order
function placeOrder() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No user logged in');
        window.location.href = 'index.html';
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


