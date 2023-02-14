const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { checkEmail, validation } = require('../middlewares/validators');

router.post('/register', checkEmail, validation, authController.register);
router.post('/login', authController.login);

module.exports = router;