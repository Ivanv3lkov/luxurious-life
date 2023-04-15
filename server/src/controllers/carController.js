const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');

const Car = require('../models/Car');
const User = require('../models/User');
const HttpError = require('../utils/httpErrorHelper');

exports.getAllCars = async (req, res, next) => {
  let cars;
  
  try {
    cars = await Car.find();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find any cars.', 500);
    return next(error);
  }
  
  if (!cars || cars.length === 0) {
    const error = new HttpError('Could not find any cars.', 404);
    return next(error);
  }
  console.log('test');
  res.json({ cars: cars.map(car => car.toObject({ getters: true })) });
};

exports.getCarById = async (req, res, next) => {
  const carId = req.params.carId;

  let car;
  try {
    car = await Car.findById(carId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a car.', 500);
    return next(error);
  }

  if (!car) {
    const error = new HttpError('Could not find car for the provided id.', 404);
    return next(error);
  }

  res.json({ car: car.toObject({ getters: true }) });
};

exports.getCarsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithCars;
  try {
    userWithCars = await User.findById(userId).populate('cars');
  } catch (err) {
    const error = new HttpError('Fetching cars failed, please try again later.', 500);
    return next(error);
  }

  if (!userWithCars || userWithCars.cars.length === 0) {
    return next(new HttpError('Could not find cars for the provided user id.', 404));
  }

  res.json({
    cars: userWithCars.cars.map(car =>
      car.toObject({ getters: true })
    )
  });
};

exports.addCar = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { model, year, description } = req.body;

  const createdCar = new Car({
    model,
    year,
    description,
    image: req.file.path,
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError('Creating car failed, please try again.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdCar.save({ session: sess });
    user.cars.push(createdCar);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating car failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ car: createdCar });
};

exports.updateCar = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { model, year, description } = req.body;
  const carId = req.params.carId;

  let car;
  try {
    car = await Car.findById(carId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update car.', 500);
    return next(error);
  }

  if (car.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this car.', 401);
    return next(error);
  }

  car.model = model;
  car.description = description;
  car.year = year;

  try {
    await car.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update car.', 500);
    return next(error);
  }

  res.status(200).json({ car: car.toObject({ getters: true }) });
};

exports.deleteCar = async (req, res, next) => {
  const carId = req.params.carId;

  let car;
  try {
    car = await Car.findById(carId).populate('creator');
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete car.', 500);
    return next(error);
  }

  if (!car) {
    const error = new HttpError('Could not find car for this id.', 404);
    return next(error);
  }

  if (car.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this car.', 401);
    return next(error);
  }

  const imagePath = car.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await car.remove({ session: sess });
    car.creator.cars.pull(car);
    await car.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete car.', 500);
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted car.' });
};

exports.reactions = async (req, res, next) => {
  const userId = req.userData.userId;
  const { carId, currentReaction } = req.body;

  const method = {
    Like: '$push',
    Love: '$push',
    Priceless: '$push',
    Unlike: '$pull',
    Unlove: '$pull',
    Worthless: '$pull'
  }
  const listsOfReactions = {
    Like: 'likes',
    Love: 'hearts',
    Priceless: 'diamonds',
    Unlike: 'likes',
    Unlove: 'hearts',
    Worthless: 'diamonds'
  }

  Car.findByIdAndUpdate(carId, {
    [method[currentReaction]]: { [`reactions.${listsOfReactions[currentReaction]}`]: userId }
  }, {
    new: true
  }).exec((err, result) => {
    if (err) {
      const error = new HttpError('Something went wrong, could not add reaction to this car.', 500);
      return next(error);
    } else {
      res.json(result)
    }
  })
}
