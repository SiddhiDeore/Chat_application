const { validateUser, verifyUserToken } = require('../controllers/authController');

const router = require('express').Router()

router.use(verifyUserToken)
router.route('/').get()
module.exports = router;