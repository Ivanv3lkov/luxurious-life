const router = require('express').Router();
const { check } = require('express-validator');

const homeController = require('../controllers/homeController');
const fileUpload = require('../middlewares/fileUpload');
const checkAuth = require('../middlewares/checkAuth');

router.get('/', homeController.getAllHomes);

router.get('/:homeId', homeController.getHomeById);

router.get('/user/:uid', homeController.getHomesByUserId);

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  homeController.createHome
);

router.patch(
  '/:homeId',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  homeController.updateHome
);

router.delete('/:homeId', homeController.deleteHome);

module.exports = router;
