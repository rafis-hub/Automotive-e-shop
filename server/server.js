// const express = require('express');
// const mongoose = require('../mongoose');
// const bodyParser = require('body-parser');
// const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');

// const app = express();
// app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/eshop', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Could not connect to MongoDB...', err));

// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Server running on port ${port}`));

const express = require('../express');
const mongoose = require('../mongoose');
const bodyParser = require('../body-parser');
const cors = require('cors');

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/eshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

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

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
