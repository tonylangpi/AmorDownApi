const express = require('express');
const router = express();

const {login, logout, mailRecoverPassword} = require('../Controllers/auth.controller');



router.post('/login', login);
router.post('/logout', logout);
router.post('/mailRecoverPassword', mailRecoverPassword);


module.exports = router;