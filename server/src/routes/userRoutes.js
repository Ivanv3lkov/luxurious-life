const router = require('express').Router();
const { check } = require('express-validator');

const userController = require('../controllers/userController');
const fileUpload = require('../middlewares/fileUpload');

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);

router.post('/login', userController.login);

router.post(
  '/register',
  fileUpload.single('image'),
  [
    check('firstName')
      .not()
      .isEmpty(),
      check('lastName')
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
