const router = require('express').Router();
const { check } = require('express-validator');

const userController = require('../controllers/userController');
const fileUpload = require('../middlewares/fileUpload');

router.get('/', userController.getUsers);

router.post('/login', userController.login);

router.post(
  '/register',
  fileUpload.single('image'),
  [
    check('name')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 6 })
  ],
  userController.register
);

module.exports = router;
