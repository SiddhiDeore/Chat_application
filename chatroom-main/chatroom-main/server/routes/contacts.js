const { addContact } = require('../controllers/userController');

const router = require('express').Router();

router.route('/').post(addContact);
module.exports = router;
