const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.login = async (username, password) => {
    const user = await User.findOne({ username });

    if (!user) {
        throw { message: 'Cannot find username or password' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw { message: 'Cannot find username or password' };
    }

    return user;
};

exports.create = async (username, password, repeatPassword, address) => {
    const existingUser = await User.findOne({ username: username.toLowerCase() });

    if (existingUser) {
        throw { message: `This username ${username} already exists` };
    }

    if (password !== repeatPassword) {
        throw { message: 'Passwords don\'t match' };
    }

    return User.create({ username, password, repeatPassword, address });
}

exports.createUserToken = async (user) => {
    const payload = { _id: user._id, username: user.username, address: user.address };
    const options = { expiresIn: '1h' };
    const SECRET = process.env.SECRET;

    const tokenPromise = new Promise((resolve, reject) => {
        jwt.sign(payload, SECRET, options, (error, decodedToken) => {
            if (error) {
                return reject(error);
            }
            resolve(decodedToken);
        });
    });

    return tokenPromise;
};
