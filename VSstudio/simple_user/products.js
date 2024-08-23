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
            ${purchasedProducts.includes(product.id) ? `<button onclick="rateProduct(${product.id})">Rate Product</button>` : ''}
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
