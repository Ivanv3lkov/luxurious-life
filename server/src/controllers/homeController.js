const router = require('express').Router();

const HttpError = require('../utils/httpErrorHelper');
const User = require('../models/User');

router.get('/users', async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again later.', 500);
    return next(error);
  }
  
  res.json({ users: 'test' })
  // res.json({ users: users.map(user => user.toObject({ getters: true })) });
});

module.exports = router;