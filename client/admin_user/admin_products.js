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


// DOM elements for products management
const productsTableBody = document.querySelector('#productsTable tbody');
const addProductForm = document.getElementById('addProductForm');


//vash 

document.addEventListener('DOMContentLoaded', function() {
    const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
    const productModal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const productForm = document.getElementById('productForm');
    const productNameInput = document.getElementById('productName');
    const productDescriptionInput = document.getElementById('productDescription');
    const productPriceInput = document.getElementById('productPrice');
    const productSubmitBtn = document.getElementById('productSubmitBtn');
    let editProductId = null;

    // Fetch and display products
    fetch('http://localhost:3000/admin_products', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
        }
    })
    .then(response => response.json())
    .then(products => {
        products.forEach(product => {
            const row = productsTable.insertRow();
            row.innerHTML = `
                <td>${product._id}</td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>
                    <button onclick="editProduct('${product._id}')">Edit</button>
                    <button onclick="deleteProduct('${product._id}')">Delete</button>
                </td>
            `;
        });
    })
    .catch(error => console.error('Error fetching products:', error));

    // Handle product creation/updating
    document.getElementById('createProductBtn').addEventListener('click', function() {
        openProductModal();
    });

    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const productData = {
            name: productNameInput.value,
            description: productDescriptionInput.value,
            price: productPriceInput.value
        };

        if (editProductId) {
            // Update product
            fetch(`http://localhost:3000/admin_products/${editProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
                },
                body: JSON.stringify(productData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Product updated successfully');
                location.reload();
            })
            .catch(error => console.error('Error updating product:', error));
        } else {
            // Create new product
            fetch('http://localhost:3000/admin_products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
                },
                body: JSON.stringify(productData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Product created successfully');
                location.reload();
            })
            .catch(error => console.error('Error creating product:', error));
        }

        closeProductModal();
    });

    // Modal handling
    function openProductModal(product = null) {
        productModal.style.display = 'block';
        if (product) {
            editProductId = product._id;
            modalTitle.textContent = 'Edit Product';
            productNameInput.value = product.name;
            productDescriptionInput.value = product.description;
            productPriceInput.value = product.price;
        } else {
            editProductId = null;
            modalTitle.textContent = 'Create Product';
            productForm.reset();
        }
    }

    function closeProductModal() {
        productModal.style.display = 'none';
    }

    document.querySelector('.close').addEventListener('click', closeProductModal);
    window.addEventListener('click', function(e) {
        if (e.target == productModal) {
            closeProductModal();
        }
    });

    // Edit product
    window.editProduct = function(productId) {
        fetch(`http://localhost:3000/admin_products/${productId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
        })
        .then(response => response.json())
        .then(product => {
            openProductModal(product);
        })
        .catch(error => console.error('Error fetching product:', error));
    };

    // Delete product
    window.deleteProduct = function(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            fetch(`http://localhost:3000/admin_products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
                }
            })
            .then(response => response.json())
            .then(data => {
                alert('Product deleted successfully');
                location.reload();
            })
            .catch(error => console.error('Error deleting product:', error));
        }
    };
});
