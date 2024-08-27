const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(express.json());

//use the routes //

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);


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



    // Signup API gia index.js
app.post('/api/users/signup', async (req, res) => {
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

app.get('/api/users/login', async (req, res) => {
    res.send("yparxei")
    });


app.get('/api/users/signup', async (req, res) => {
    res.send("yparxei")
    // res.save();
    });

// Login API gia index.js
app.post('/api/users/login', async (req, res) => {
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



// Get cart items gia checkout.js
app.get('/api/cart', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.send({ cartItems: user.cart });
});

// Purchase and create an order gia checkout.js
app.post('/api/orders', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user.cart.length === 0) return res.status(400).send({ error: 'Cart is empty.' });

    const order = new Order({
        user: user._id,
        items: user.cart.map(item => ({
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price
        })),
        total: user.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    });

    await order.save();

    // Clear the user's cart after purchase gia checkout.js
    user.cart = [];
    await user.save();

    res.send(order);
});

// Get previous orders gia checkout.js
app.get('/api/orders', authenticateToken, async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send({ orders });
});







// Get all products for products.js
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.send({ products });
});

// Search products for products.js
app.get('/api/products/search', async (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const products = await Product.find({
        name: { $regex: query, $options: 'i' }
    });
    res.send({ products });
});

// Add product to cart for products.js
app.post('/api/cart', authenticateToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) return res.status(404).send({ error: 'Product not found.' });

    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.send({ message: 'Product added to cart.' });
});


// Routes for Products
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Routes for User
app.post('/user/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.post('/user/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.json(user);
});

// Routes for Cart
app.get('/user/:userId/cart', async (req, res) => {
    const user = await User.findById(req.params.userId).populate('cart.productId');
    res.json(user.cart);
});

app.post('/user/:userId/cart', async (req, res) => {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.params.userId);
    const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
        user.cart[itemIndex].quantity += quantity;
    } else {
        user.cart.push({ productId, quantity });
    }

    await user.save();
    res.json(user.cart);
});

// Routes for Orders
app.post('/user/:userId/order', async (req, res) => {
    const user = await User.findById(req.params.userId);
    const order = new Order({
        userId: user._id,
        items: user.cart,
        totalAmount: req.body.totalAmount,
    });

    await order.save();
    user.cart = [];
    await user.save();
    res.json(order);
});

app.get('/user/:userId/orders', async (req, res) => {
    const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
    res.json(orders);
});

