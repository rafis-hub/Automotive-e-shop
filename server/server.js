require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

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

//errorr handling//
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
// User schema and model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // role: { type: String, default: user },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

  
  const User = mongoose.model('User', userSchema);
  module.exports = User;

 // Signup endpoint
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

      try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).send('User already registered.');
      }
        // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
      user = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      await user.save();
  
      res.send('User registered successfully!');
    } catch (error) {
      res.status(500).send('Something went wrong. Please try again.');
    }
  });



/// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send('Invalid email or password.');
      }
      // Validate password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).send('Invalid email or password.');
      }
    //   Generate JWT token
      const token = jwt.sign(user, process.env.JWT_SECRET);
      res.header('x-auth-token', token).send('Login successful!', token);
      // return all the data
      res.status(200).json({ 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        cart: user.cart, 
        favorites: user.favorites 
        
    });
    } catch (error) {
      res.status(500).send('Something went wrong. Please try again.');
    }
  });


  //token auth //
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the decoded user info to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).send('Invalid token.');
    }
}
module.exports = authenticateToken;


//profile get 

app.get('/profile', authenticateToken,  async (req, res) => {
    try {
        // Assuming req.user is populated with the user object
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).send('User ID is missing');
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.json(user);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).send('Server error');
    }
});

//profile update

app.put('/profile', authenticateToken, async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);

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


// Model for Product 

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;



// Get all products for products.js
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
app.get('/products/search', async (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const products = await Product.find({
        name: { $regex: query, $options: 'i' }
    });
    res.send({ products });
});

// add to cart
app.post('/cart', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.cart.includes(productId)) {
            user.cart.push(productId);
            await user.save();
        }
        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: 'Server error adding to cart' });
    }
});

//add to favorites

app.post('/favorites', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
        }
        res.status(200).json({ message: 'Product added to favorites' });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        res.status(500).json({ message: 'Server error adding to favorites' });
    }
});


// retrieve the users cart items and their details

app.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('cart');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.cart);
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ message: 'Server error fetching cart items' });
    }
});

//purchase the items in the cart, clear the cart and save the order

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

app.get('/favorites/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.favorites);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: 'Server error fetching favorites' });
    }
});
