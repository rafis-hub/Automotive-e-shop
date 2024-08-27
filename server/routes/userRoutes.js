const express = require('express');
const { signup, login } = require('../controllers/userController'); // Import user controller functions

const router = express.Router();

router.post('/signup', signup); // Signup route
router.post('/login', login); // Login route

module.exports = router; // Export the router
