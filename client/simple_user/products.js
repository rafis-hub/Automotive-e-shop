// products.js

document.addEventListener('DOMContentLoaded', loadProducts);

const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', searchProducts);

// Load all products
function loadProducts() {
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                displayProducts(data.products);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Display products
function displayProducts(products) {
    productsContainer.innerHTML = '';

    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart('${product._id}')">Add to Cart</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Search for products
function searchProducts() {
    const query = searchInput.value.toLowerCase();

    fetch(`http://localhost:3000/api/products/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                displayProducts(data.products);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Add a product to the cart
function addToCart(productId) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You must be logged in to add items to your cart.');
        window.location.href = 'index.html';
        return;
    }

    fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Product added to cart!');
        }
    })
    .catch(error => console.error('Error:', error));
}

function logout() {
    localStorage.removeItem('token');
    alert('Logout successful!');
    window.location.href = 'index.html';
}
