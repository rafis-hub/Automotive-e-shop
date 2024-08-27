const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });
        if (user) return res.status(400).send('User already exists');

        user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ _id: user._id }, 'secretKey', { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username });
        if (!user) return res.status(400).send('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, 'secretKey', { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
