//gia na gemish h vash

// to trexw me node.js


const mongoose = require('../mongoose');
const bcrypt = require('../bcryptjs');

// Replace with your MongoDB connection string
mongoose.connect('mongodb://localhost:27017/your-db-name', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define schemas and models
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String
});

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number
});

const OrderSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    products: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
    totalPrice: Number,
    status: String
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

async function seedDatabase() {
    // Create an admin user
    const adminPassword = await bcrypt.hash('adminpassword', 10);
    const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin'
    });

    const userPassword = await bcrypt.hash('userpassword', 10);
    const user = new User({
        username: 'user',
        email: 'user@example.com',
        password: userPassword,
        role: 'user'
    });

    await admin.save();
    await user.save();

    // Create some products
    const product1 = new Product({
        name: 'Product 1',
        description: 'Description for product 1',
        price: 100,
        category: 'Category 1',
        stock: 50
    });

    const product2 = new Product({
        name: 'Product 2',
        description: 'Description for product 2',
        price: 150,
        category: 'Category 2',
        stock: 30
    });

    await product1.save();
    await product2.save();

    // Create an order
    const order = new Order({
        userId: user._id,
        products: [
            { productId: product1._id, quantity: 2 },
            { productId: product2._id, quantity: 1 }
        ],
        totalPrice: 350,
        status: 'Pending'
    });

    await order.save();

    console.log('Database seeded!');
    mongoose.connection.close();
}

seedDatabase().catch(err => {
    console.error(err);
    mongoose.connection.close();
});
