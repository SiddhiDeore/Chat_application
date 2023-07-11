const {
  verifyUserToken,
  sendUserToken,
} = require('../controllers/authController');
const {
  getUserDetails,
  completeUserProfile,
  addContact,
} = require('../controllers/userController');

const router = require('express').Router();

router.use(verifyUserToken);
router.route('/profile/complete').put(completeUserProfile, sendUserToken);
router.route('/profile').get(getUserDetails);
router.route('/contact').post(addContact);

module.exports = router;
