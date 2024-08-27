// Product Data
let products = [
    { id: 1, name: 'Battery', description: '', price: 10, rating: 4.5, image: 'C:/Users/mr/Desktop/VSstudio/images/car_battery.jpeg' },
    { id: 2, name: 'Cleanser', description: '', price: 20, rating: 3.7, image: 'C:/Users/mr/Desktop/VSstudio/images/car_cleanser.png' },
    { id: 3, name: 'Fregreances', description: '', price: 15, rating: 4.2, image: 'C:/Users/mr/Desktop/VSstudio/images/car_fregreance.jpg' },
    { id: 4, name: 'Pads', description: '', price: 10, rating: 4.5, image: 'C:/Users/mr/Desktop/VSstudio/images/car_pads.jpg' },
    { id: 5, name: 'Antenna', description: '', price: 20, rating: 3.7, image: 'C:/Users/mr/Desktop/VSstudio/images/car_antenna.jpg' },
    { id: 6, name: 'Wax', description: '', price: 15, rating: 4.2, image: 'C:/Users/mr/Desktop/VSstudio/images/car_wax.jpeg' },
    { id: 7, name: 'Tiers', description: '', price: 10, rating: 4.5, image: 'C:/Users/mr/Desktop/VSstudio/images/car_tiers.jpg' },
    { id: 8, name: 'Wheels', description: '', price: 15, rating: 4.2, image: 'C:/Users/mr/Desktop/VSstudio/images/car_wheels.jpg' },
    // Add more products as needed
];

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let purchasedProducts = JSON.parse(localStorage.getItem('purchasedProducts')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');

// Event Listeners
searchInput.addEventListener('input', displayProducts);

// Initialize
displayProducts();

// Functions

function displayProducts() {
    productsContainer.innerHTML = '';

    const searchQuery = searchInput.value.toLowerCase();

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Rating: ${product.rating} / 5</p>
            <button onclick="addToFavorites(${product.id})">Add to Favorites</button>
            <button onclick="rateProduct(${product.id})">Rate Product</button>
             <button onclick="addToCart(${product.id})">Add to Cart </button>
            
        `;

        productsContainer.appendChild(productCard);
    });
}

function addToFavorites(productId) {
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Product added to favorites!');
    } else {
        alert('Product is already in favorites.');
    }
}

function rateProduct(productId) {
    const rating = prompt('Enter your rating (1 to 5):');
    if (rating >= 1 && rating <= 5) {
        const product = products.find(p => p.id === productId);
        product.rating = ((product.rating + parseFloat(rating)) / 2).toFixed(1);
        alert('Thank you for your rating!');
        displayProducts();
    } else {
        alert('Invalid rating. Please enter a number between 1 and 5.');
    }

}
function addToCart(productId) {
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
    } else {
        alert('Product is already in cart.');
    }
}

//gia thn vash

// Fetch and display products
// async function displayProducts() {
//     const response = await fetch('/products');
//     const products = await response.json();

//     productsContainer.innerHTML = '';

//     products.forEach(product => {
//         const productCard = document.createElement('div');
//         productCard.classList.add('product-card');
        
//         productCard.innerHTML = `
//             <img src="${product.image}" alt="${product.name}">
//             <h3>${product.name}</h3>
//             <p>${product.description}</p>
//             <p>Price: $${product.price}</p>
//             <p>Rating: ${product.rating} / 5</p>
//             <button onclick="addToFavorites('${product._id}')">Add to Favorites</button>
//             <button onclick="rateProduct('${product._id}')">Rate Product</button>
//             <button onclick="addToCart('${product._id}')">Add to Cart</button>
//         `;

//         productsContainer.appendChild(productCard);
//     });
// }


// // // API Fetch Products
// // function fetchProducts() {
// //     fetch('http://localhost:3000/api/products')
// //         .then(response => response.json())
// //         .then(products => {
// //             // Render products on the page
// //             console.log(products);
// //         })
// //         .catch(error => console.error('Error fetching products:', error));
// // }

// // API Add to Favourites
// function addToFavourites(productId) {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         alert('No user logged in');
//         window.location.href = 'login.html';
//         return;
//     }

//     fetch(`http://localhost:3000/api/users/favourites`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ productId })
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert('Added to favourites!');
//     })
//     .catch(error => console.error('Error adding to favourites:', error));
// }

const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', displayProducts);

// Initialize
displayProducts();

async function displayProducts() {
    productsContainer.innerHTML = '';

    const searchQuery = searchInput.value.toLowerCase();
    const response = await fetch('/products');
    const products = await response.json();

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Rating: ${product.rating} / 5</p>
            <button onclick="addToFavorites('${product._id}')">Add to Favorites</button>
            <button onclick="rateProduct('${product._id}')">Rate Product</button>
            <button onclick="addToCart('${product._id}')">Add to Cart</button>
        `;

        productsContainer.appendChild(productCard);
    });
}

async function addToFavorites(productId) {
    const userId = 'replace-with-logged-in-user-id';  // Manage user sessions properly
    const response = await fetch(`/user/${userId}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
    });

    if (response.ok) {
        alert('Product added to favorites!');
    } else {
        alert('Failed to add product to favorites.');
    }
}

async function rateProduct(productId) {
    const rating = prompt('Enter your rating (1 to 5):');
    if (rating >= 1 && rating <= 5) {
        const response = await fetch(`/products/${productId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: parseFloat(rating) })
        });

        if (response.ok) {
            alert('Thank you for your rating!');
            displayProducts();
        } else {
            alert('Failed to rate product.');
        }
    } else {
        alert('Invalid rating. Please enter a number between 1 and 5.');
    }
}

async function addToCart(productId) {
    const userId = 'replace-with-logged-in-user-id';  // Manage user sessions properly
    const response = await fetch(`/user/${userId}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
    });

    if (response.ok) {
        alert('Product added to cart!');
    } else {
        alert('Failed to add product to cart.');
    }
}


