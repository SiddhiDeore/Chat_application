const {
  sendUserToken,
  validateUser,
} = require('../controllers/authController');
const {
  createUser,
  getUserByPhone,
} = require('../controllers/userController');
const router = require('express').Router();


router.route('/signin').post(validateUser, createUser, sendUserToken);
router.route('/').get(getUserByPhone);

module.exports = router;
