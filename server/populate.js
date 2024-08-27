const mongoose = require('../mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/eshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const products = [
    { name: 'Battery', description: '', price: 10, rating: 4.5, image: '/images/car_battery.jpeg' },
    { name: 'Cleanser', description: '', price: 20, rating: 3.7, image: '/images/car_cleanser.png' },
    // Add more products...
];

Product.insertMany(products)
    .then(() => {
        console.log('Products added successfully');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error adding products:', err);
    });
