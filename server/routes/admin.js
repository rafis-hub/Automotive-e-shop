const express = require('express');
const { getAllUsers, updateUser, deleteUser, getAllProducts, updateProduct, deleteProduct, createProduct, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/adminController');

const router = express.Router();

// Middleware function to check if the user is an admin
const isAdmin = (req, res, next) => {
    // Replace this with your actual admin check logic
    const userIsAdmin = true; // Example: This should be a real check, e.g., req.user.role === 'admin'
    if (userIsAdmin) {
        next(); // User is admin, proceed to the next middleware or route handler
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

// User management routes
router.get('/users', isAdmin, getAllUsers);
router.put('/users/:id', isAdmin, updateUser);
router.delete('/users/:id', isAdmin, deleteUser);

// Product management routes
router.get('/products', isAdmin, getAllProducts);
router.post('/products', isAdmin, createProduct);
router.put('/products/:id', isAdmin, updateProduct);
router.delete('/products/:id', isAdmin, deleteProduct);

// Order management routes
router.get('/orders', isAdmin, getAllOrders);
router.put('/orders/:id', isAdmin, updateOrderStatus);
router.delete('/orders/:id', isAdmin, deleteOrder);

module.exports = router;
