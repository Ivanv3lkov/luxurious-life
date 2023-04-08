const bcrypt = require('bcryptjs');
const fs = require('fs');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const HttpError = require('../utils/httpErrorHelper');
const { createUserToken } = require('../services/authService');
const { SALT_ROUNDS } = require('../constants/constants');
const { default: mongoose } = require('mongoose');

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again later.', 500);
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

exports.getUserById = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Fetching user failed, please try again later.', 500);
    return next(error);
  }
  res.json({ user: user.toObject({ getters: true }) });
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Login failed, please try again later.', 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('Invalid credentials, could not log you in.', 403);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials, could not log you in.', 403);
    return next(error);
  }

  let accessToken;
  try {
    accessToken = createUserToken(existingUser);
  } catch (err) {
    const error = new HttpError('Login failed, please try again later.', 500);
    return next(error);
  }

  res.json({
    accessToken: accessToken,
    userId: existingUser.id,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    email: existingUser.email,
    image: existingUser.image,
    homesCount: existingUser.homes.length,
    carsCount: existingUser.cars.length,
  });
};

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid inputs passed, please check your data.', 422);
    return next(error);
  }

  const { firstName, lastName, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User exists already, please login instead.', 422);
    return next(error);
  }

  let hashedPassword;
  try {

    hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  } catch (err) {
    const error = new HttpError('Could not create user, please try again.', 500);
    return next(error);
  }

  const createdUser = new User({
    firstName,
    lastName,
    email,
    image: req.file.path,
    password: hashedPassword,
    homes: [],
    cars: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  let accessToken;
  try {
    accessToken = createUserToken(createdUser);
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  res
    .status(201)
    .json({
      accessToken: accessToken,
      userId: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      image: createdUser.image,
      homesCount: createdUser.homes.length,
      carsCount: createdUser.cars.count
    });
};

exports.updateUserProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { firstName, lastName } = req.body;
  const userId = req.params.userId;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update user.', 500);
    return next(error);
  }


  user.firstName = firstName;
  user.lastName = lastName;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update user.', 500);
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete user.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for this id.', 404);
    return next(error);
  }

  const imagePath = user.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await user.remove({ session: sess });  
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete user.', 500);
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted user.' });
};
