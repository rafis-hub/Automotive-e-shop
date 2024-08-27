const express = require('express');
const { isAdmin } = require('../middlewares/authMiddleware');
const {
    getAllUsers,
    updateUser,
    deleteUser,
    getAllProducts,
    updateProduct,
    deleteProduct,
    createProduct,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/adminController');

const router = express.Router();

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
