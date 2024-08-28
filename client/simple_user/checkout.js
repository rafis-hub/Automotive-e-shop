document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cartContainer');
    const totalAmountElement = document.getElementById('totalAmount');
    const purchaseButton = document.getElementById('purchaseButton');
    const userId = 'user-id-here'; // Replace with the actual logged-in user's ID

    // Fetch and display cart items
    fetch(`/cart/${userId}`)
        .then(response => response.json())
        .then(cartItems => {
            displayCartItems(cartItems);
            calculateTotal(cartItems);
        })
        .catch(error => console.error('Error fetching cart items:', error));

    // Function to display cart items
    function displayCartItems(cartItems) {
        cartContainer.innerHTML = '';
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <img src="${item.imageUrl}" alt="${item.name}" />
            `;
            cartContainer.appendChild(itemElement);
        });
    }

    // Function to calculate and display total amount
    function calculateTotal(cartItems) {
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        totalAmountElement.textContent = total.toFixed(2);
    }

    // Handle purchase button click
    purchaseButton.addEventListener('click', () => {
        fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Purchase successful') {
                alert('Purchase successful!');
                // Optionally redirect to a success or orders page
                window.location.reload(); // Reload page to refresh cart
            } else {
                alert('Purchase failed: ' + data.message);
            }
        })
        .catch(error => console.error('Error during purchase:', error));
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('ordersContainer');
    const userId = 'user-id-here'; // Replace with the actual logged-in user's ID

    // Fetch and display previous orders
    fetch(`/orders/${userId}`)
        .then(response => response.json())
        .then(orders => displayOrders(orders))
        .catch(error => console.error('Error fetching orders:', error));

    // Function to display orders
    function displayOrders(orders) {
        ordersContainer.innerHTML = '';
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';
            orderElement.innerHTML = `
                <h3>Order ID: ${order._id}</h3>
                <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
                <p>Status: ${order.status}</p>
                <ul>
                    ${order.products.map(product => `
                        <li>${product.name} - $${product.price.toFixed(2)}</li>
                    `).join('')}
                </ul>
            `;
            ordersContainer.appendChild(orderElement);
        });
    }
});
