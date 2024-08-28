document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    // const email = user.email;  // Replace with the actual logged-in user's ID
   
    // Fetch and display products
    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error('Error fetching products:', error));

    // Function to display products
    function displayProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
                <img src="${product.imageUrl}" alt="${product.name}" />
                <button data-product-id="${product._id}" class="add-to-cart">Add to Cart</button>
                <button data-product-id="${product._id}" class="add-to-favorites">Add to Favorites</button>
            `;
            productsContainer.appendChild(productElement);
        });
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        fetch('http://localhost:3000/products')
            .then(response => response.json())
            .then(products => {
                const filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) || 
                    product.description.toLowerCase().includes(searchTerm)
                );
                displayProducts(filteredProducts);
            })
            .catch(error => console.error('Error filtering products:', error));
    });

    // Add to cart functionality
    productsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            addToCart(userId, productId);
        } else if (e.target.classList.contains('add-to-favorites')) {
            const productId = e.target.getAttribute('data-product-id');
            addToFavorites(userId, productId);
        }
    });

    // function addToCart(userId, productId) {
    //     fetch('http://localhost:3000/cart', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ userId, productId })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         alert(data.message || 'Added to cart');
    //     })
    //     .catch(error => console.error('Error adding to cart:', error));
    // }

    // function addToFavorites(userId, productId) {
    //     fetch('http://localhost:3000/favorites', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ userId, productId })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         alert(data.message || 'Added to favorites');
    //     })
    //     .catch(error => console.error('Error adding to favorites:', error));
    // }
    


// // Example: Adding a product to the cart
// fetch('http://localhost:3000/cart', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + localStorage.getItem('token') // Send the JWT token
//     },
//     body: JSON.stringify({ productId: 'PRODUCT_ID_HERE' })
// })
// .then(response => response.json())
// .then(data => {
//     console.log(data.message);
// })
// .catch(error => console.error('Error:', error));

// // Example: Adding a product to favorites
// fetch('http://localhost:3000/favorites', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + localStorage.getItem('token') // Send the JWT token
//     },
//     body: JSON.stringify({ productId: 'PRODUCT_ID_HERE' })
// })
// .then(response => response.json())
// .then(data => {
//     console.log(data.message);
// })
// .catch(error => console.error('Error:', error));

// Example: Adding a product to the cart
// fetch('http://localhost:3000/cart', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ email: email , productId: product._id })
// })
// .then(response => response.json())
// .then(data => {
//     console.log(data.message);
// })
// .catch(error => console.error('Error:', error));

// // Example: Adding a product to favorites
// fetch('http://localhost:3000/favorites', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
    
//     body: JSON.stringify({ email: userEmail, productId: product._id })
// })
// .then(response => response.json())
// .then(data => {
//     console.log(data.message);
// })
// .catch(error => console.error('Error:', error));

// Add product to cart
fetch('http://localhost:3000/cart', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: user._id, productId: product._id })
})
.then(response => response.json())
.then(data => {
    console.log(data.message);
})
.catch(error => console.error('Error:', error));

// Add product to favorites
fetch('http://localhost:3000/favorites', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: user._id, productId: product._id  })
})
.then(response => response.json())
.then(data => {
    console.log(data.message);
})
.catch(error => console.error('Error:', error));

});