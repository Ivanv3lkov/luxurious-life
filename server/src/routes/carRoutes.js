const router = require('express').Router();
const { check } = require('express-validator');

const carController = require('../controllers/carController');
const fileUpload = require('../middlewares/fileUpload');
const checkAuth = require('../middlewares/checkAuth');

router.get('/', carController.getAllCars);

router.get('/:carId', carController.getCarById);

router.get('/user/:uid', carController.getCarsByUserId);

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('model')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  carController.addCar
);

router.patch(
  '/:carId',
  [
    check('model')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  carController.updateCar
);

router.delete('/:carId', carController.deleteCar);

module.exports = router;
