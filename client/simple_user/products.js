// API Fetch Products
function fetchProducts() {
    fetch('http://localhost:3000/api/products')
        .then(response => response.json())
        .then(products => {
            // Render products on the page
            console.log(products);
        })
        .catch(error => console.error('Error fetching products:', error));
}

async function displayProducts() {
    const response = await fetch('/products');
    const products = await response.json();

    productsContainer.innerHTML = '';

    products.forEach(product => {
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


// API Add to Favourites
function addToFavourites(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('No user logged in');
        window.location.href = 'login.html';
        return;
    }

    fetch(`http://localhost:3000/api/users/favourites`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
    })
    .then(response => response.json())
    .then(data => {
        alert('Added to favourites!');
    })
    .catch(error => console.error('Error adding to favourites:', error));
}

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


