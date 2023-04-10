const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');

const Home = require('../models/Home');
const User = require('../models/User');
const getCoordsForAddress = require('../utils/location');
const HttpError = require('../utils/httpErrorHelper');

exports.getAllHomes = async (req, res, next) => {
  let homes;
  try {
    homes = await Home.find();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find any homes.', 500);
    return next(error);
  }

  if (!homes) {
    const error = new HttpError('Could not find any homes.', 404);
    return next(error);
  }

  res.json({ homes: homes.map(home => home.toObject({ getters: true })) });
};

exports.getHomeById = async (req, res, next) => {
  const homeId = req.params.homeId;

  let home;
  try {
    home = await Home.findById(homeId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a home.', 500);
    return next(error);
  }

  if (!home) {
    const error = new HttpError('Could not find home for the provided id.', 404);
    return next(error);
  }

  res.json({ home: home.toObject({ getters: true }) });
};

exports.getHomesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithHomes;
  try {
    userWithHomes = await User.findById(userId).populate('homes');
  } catch (err) {
    const error = new HttpError('Fetching homes failed, please try again later.', 500);
    return next(error);
  }

  if (!userWithHomes || userWithHomes.homes.length === 0) {
    return next(new HttpError('Could not find homes for the provided user id.', 404));
  }

  res.json({
    homes: userWithHomes.homes.map(home =>
      home.toObject({ getters: true })
    )
  });
};

exports.createHome = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, address } = req.body;
  
  let coordinates;
  
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdHome = new Home({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError('Creating home failed, please try again.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdHome.save({ session: sess });
    user.homes.push(createdHome);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating home failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ home: createdHome });
};

exports.updateHome = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description } = req.body;
  const homeId = req.params.homeId;

  let home;
  try {
    home = await Home.findById(homeId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update home.', 500);
    return next(error);
  }

  if (home.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this home.', 401);
    return next(error);
  }

  home.title = title;
  home.description = description;

  try {
    await home.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update home.', 500);
    return next(error);
  }

  res.status(200).json({ home: home.toObject({ getters: true }) });
};

exports.deleteHome = async (req, res, next) => {
  const homeId = req.params.homeId;

  let home;
  try {
    home = await Home.findById(homeId).populate('creator');
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete home.', 500);
    return next(error);
  }

  if (!home) {
    const error = new HttpError('Could not find home for this id.', 404);
    return next(error);
  }

  if (home.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this home.', 401);
    return next(error);
  }

  const imagePath = home.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await home.remove({ session: sess });
    home.creator.homes.pull(home);
    await home.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete home.', 500);
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted home.' });
};
