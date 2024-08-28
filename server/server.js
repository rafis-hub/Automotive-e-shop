const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());


// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


// Start the database
mongoose.connect('mongodb+srv://marRAF:Yn9xay0w0vK0Uq4R@eshopdb.odnjr.mongodb.net/?retryWrites=true&w=majority&appName=eshopdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// user model//

    const userSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    });
      
const User = mongoose.model('User', userSchema);
    


    // Signup API gia index.js
app.post('/signup', async (req, res) => {

    const { name, email, password } = req.body;
    console.log("req.body");
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).send({ message: 'User already registered.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ _id: user._id, role: user.role }, 'jwtPrivateKey');
    res.send({ token });
});


// Login API gia index.js
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("req.body");
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send({ message: 'Invalid email or password.' });

    // Generate JWT
    const token = jwt.sign({ _id: user._id, role: user.role }, 'jwtPrivateKey');
    res.send({ token });
});

// Middleware to authenticate the token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) return res.status(401).send({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ error: 'Invalid token.' });
    }
}

// view profile for profile.js
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        // const user = await User.find(_id);
        const user = req.user._id;
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

//update profile for profile.js
app.put('/profile', authenticateToken, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = req.user._id;
        // const user = await User.find(email);
        // const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10); // Encrypt the new password

        await user.save();
        res.send('Profile updated successfully');
    } catch (err) {
        res.status(500).send('Server error');
    }
});


//product model

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);



// // Get cart items gia checkout.js
// app.get('/api/cart', authenticateToken, async (req, res) => {
//     const user = await User.findById(req.user._id).populate('cart.product');
//     res.send({ cartItems: user.cart });
// });

// // Purchase and create an order gia checkout.js
// app.post('/api/orders', authenticateToken, async (req, res) => {
//     const user = await User.findById(req.user._id);

//     if (user.cart.length === 0) return res.status(400).send({ error: 'Cart is empty.' });

//     const order = new Order({
//         user: user._id,
//         items: user.cart.map(item => ({
//             productName: item.product.name,
//             quantity: item.quantity,
//             price: item.product.price
//         })),
//         total: user.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
//     });

//     await order.save();

//     // Clear the user's cart after purchase gia checkout.js
//     user.cart = [];
//     await user.save();

//     res.send(order);
// });

// // Get previous orders gia checkout.js
// app.get('/api/orders', authenticateToken, async (req, res) => {
//     const orders = await Order.find({ user: req.user._id });
//     res.send({ orders });
// });







// // Get all products for products.js

// app.get('/products', async (req, res) => {
//     const products = await Product.find();
//     res.send({ products });
// });
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error fetching products" });
    }
});


// Search products for products.js
app.get('/products', async (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const products = await Product.find({
        name: { $regex: query, $options: 'i' }
    });
    res.send({ products });
});

// Add product to cart for products.js
// app.post('/cart', async (req, res) => {
//     const { productId, quantity } = req.body;
//     const user = await User.findById(req.user.id);
//     const product = await Product.findById(productId);

//     if (!product) return res.status(404).send({ error: 'Product not found.' });

//     const cartItem = user.cart.find(item => item.product.toString() === productId);

//     if (cartItem) {
//         cartItem.quantity += quantity;
//     } else {
//         user.cart.push({ product: productId, quantity });
//     }

//     await user.save();
//     res.send({ message: 'Product added to cart.' });
// });

// app.post('/favorites', async (req, res) => {
//     const { userId, productId } = req.body;
//     try {
//         // const user = await User.findById(req.user._id);
//         const product = await Product.findById(productId);
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         if (!user.favorites.includes(productId)) {
//             user.favorites.push(productId);
//             await user.save();
//         }
//         res.status(200).json({ message: 'Product added to favorites' });
//     } catch (error) {
//         console.error("Error adding to favorites:", error);
//         res.status(500).json({ message: 'Server error adding to favorites' });
//     }
// });

// app.post('/cart', authenticateToken, async (req, res) => {
//     const { productId } = req.body; // Only productId is required from the request body

//     try {
//         // Use the user ID from the authenticated token
//         const user = await User.findById(req.user._id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the product is already in the cart
//         if (!user.cart.includes(productId)) {
//             user.cart.push(productId); // Add the product ID to the cart
//             await user.save(); // Save the updated user document
//         }

//         res.status(200).json({ message: 'Product added to cart' });
//     } catch (error) {
//         console.error("Error adding to cart:", error);
//         res.status(500).json({ message: 'Server error adding to cart' });
//     }
// });

// app.post('/favorites', authenticateToken, async (req, res) => {
//     const { productId } = req.body; // Only productId is required from the request body

//     try {
//         // Use the user ID from the authenticated token
//         const user = await User.findById(req.user._id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the product is already in the favorites
//         if (!user.favorites.includes(productId)) {
//             user.favorites.push(productId); // Add the product ID to the favorites
//             await user.save(); // Save the updated user document
//         }

//         res.status(200).json({ message: 'Product added to favorites' });
//     } catch (error) {
//         console.error("Error adding to favorites:", error);
//         res.status(500).json({ message: 'Server error adding to favorites' });
//     }
// });

// app.post('/cart', async (req, res) => {
//     const { email, productId } = req.body; // Use email and productId from the request body

//     try {
//         const user = await User.findOne({ email }); // Find the user by email
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the product is already in the cart
//         if (!user.cart.includes(productId)) {
//             user.cart.push(productId); // Add the product ID to the cart
//             await user.save(); // Save the updated user document
//         }

//         res.status(200).json({ message: 'Product added to cart' });
//     } catch (error) {
//         console.error("Error adding to cart:", error);
//         res.status(500).json({ message: 'Server error adding to cart' });
//     }
// });

// app.post('/favorites', async (req, res) => {
//     const { email, productId } = req.body; // Use email and productId from the request body

//     try {
//         const user = await User.findOne({ email }); // Find the user by email
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the product is already in the favorites
//         if (!user.favorites.includes(productId)) {
//             user.favorites.push(productId); // Add the product ID to the favorites
//             await user.save(); // Save the updated user document
//         }

//         res.status(200).json({ message: 'Product added to favorites' });
//     } catch (error) {
//         console.error("Error adding to favorites:", error);
//         res.status(500).json({ message: 'Server error adding to favorites' });
//     }
// });

// app.post('/cart', async (req, res) => {
//     const { productId } = req.body;

//     try {
//         // Assume the user is logged in and we have their email
//         const email = req.user.email; // replace with session-stored or passed-in email
        
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         if (!user.cart.includes(productId)) {
//             user.cart.push(productId);
//             await user.save();
//         }
//         res.status(200).json({ message: 'Product added to cart' });
//     } catch (error) {
//         console.error("Error adding to cart:", error);
//         res.status(500).json({ message: 'Server error adding to cart' });
//     }
// });

// app.post('/favorites', async (req, res) => {
//     const { productId } = req.body;

//     try {
//         // Assume the user is logged in and we have their email
//         const email = req.user.email; // replace with session-stored or passed-in email

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         if (!user.favorites.includes(productId)) {
//             user.favorites.push(productId);
//             await user.save();
//         }
//         res.status(200).json({ message: 'Product added to favorites' });
//     } catch (error) {
//         console.error("Error adding to favorites:", error);
//         res.status(500).json({ message: 'Server error adding to favorites' });
//     }
// });

// Add product to cart
app.post('/cart', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Assume the user is logged in, and we have their email from a session or JWT
        // const userid = userId; // Replace with session-stored or token-stored email

        // const user = await User.findById(userId);
        const user = await User.findById(userId).populate('cart').populate('favorites');
        if (!user) {
            console.log("user no found");
            return res.status(404).json({ message: 'User not found' });
            
        }

        // Add product to cart if not already present
        if (!user.cart.includes(productId)) {
            user.cart.push(productId);
            await user.save();
            return res.status(200).json({ message: 'Product added to cart' });
        } else {
            return res.status(200).json({ message: 'Product is already in the cart' });
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ message: 'Server error adding to cart' });
    }
});

// Add product to favorites
app.post('/favorites', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Assume the user is logged in, and we have their email from a session or JWT
        // const userid = userId; // Replace with session-stored or token-stored email
        const user = await User.findById(userId).populate('cart').populate('favorites');
        // const user = await User.findById(userId );
        if (!user) {
            console.log("user no found");
            return res.status(404).json({ message: 'User not found' });
        }

        // Add product to favorites if not already present
        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
            return res.status(200).json({ message: 'Product added to favorites' });
        } else {
            return res.status(200).json({ message: 'Product is already in favorites' });
        }
    } catch (error) {
        console.error("Error adding to favorites:", error);
        return res.status(500).json({ message: 'Server error adding to favorites' });
    }
});



// // Routes for Products
// app.get('/products', async (req, res) => {
//     const products = await Product.find();
//     res.json(products);
// });

// // Routes for User
// app.post('/user/login', async (req, res) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username, password });
//     if (user) {
//         res.json(user);
//     } else {
//         res.status(401).json({ message: 'Invalid credentials' });
//     }
// });

// app.post('/user/register', async (req, res) => {
//     const { username, password } = req.body;
//     const user = new User({ username, password });
//     await user.save();
//     res.json(user);
// });

// // Routes for Cart
// app.get('/user/:userId/cart', async (req, res) => {
//     const user = await User.findById(req.params.userId).populate('cart.productId');
//     res.json(user.cart);
// });

// app.post('/user/:userId/cart', async (req, res) => {
//     const { productId, quantity } = req.body;
//     const user = await User.findById(req.params.userId);
//     const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

//     if (itemIndex > -1) {
//         user.cart[itemIndex].quantity += quantity;
//     } else {
//         user.cart.push({ productId, quantity });
//     }

//     await user.save();
//     res.json(user.cart);
// });

//cart
// app.get('/cart/:userId', async (req, res) => {
//     const { userId } = req.params;
//     try {
//         const user = await User.findById(userId).populate('cart');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user.cart);
//     } catch (error) {
//         console.error("Error fetching cart items:", error);
//         res.status(500).json({ message: 'Server error fetching cart items' });
//     }
// });

//checkout
app.post('/checkout', async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId).populate('cart');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new order from the cart
        const order = new Order({
            user: user._id,
            products: user.cart,
            totalAmount: user.cart.reduce((total, product) => total + product.price, 0),
            status: 'Processing'
        });

        await order.save();

        // Clear the user's cart
        user.cart = [];
        await user.save();

        res.status(200).json({ message: 'Purchase successful', orderId: order._id });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).json({ message: 'Server error during checkout' });
    }
});

//order model
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Processing' },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

app.get('/orders/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ user: userId }).populate('products');
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// app.get('/favorites/:userId', async (req, res) => {
//     const { userId } = req.params;
//     try {
//         const user = await User.findById(userId).populate('favorites');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user.favorites);
//     } catch (error) {
//         console.error("Error fetching favorites:", error);
//         res.status(500).json({ message: 'Server error fetching favorites' });
//     }
// });



// // Routes for Orders
// app.post('/user/:userId/order', async (req, res) => {
//     const user = await User.findById(req.params.userId);
//     const order = new Order({
//         userId: user._id,
//         items: user.cart,
//         totalAmount: req.body.totalAmount,
//     });

//     await order.save();
//     user.cart = [];
//     await user.save();
//     res.json(order);
// });

// app.get('/user/:userId/orders', async (req, res) => {
//     const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
//     res.json(orders);
// });



//all of the above is for the simple user//
// lets continue iwth the admin user///


