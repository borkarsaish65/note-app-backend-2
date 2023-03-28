const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller')




router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/activate-account', userController.activateAccount);




module.exports = router;