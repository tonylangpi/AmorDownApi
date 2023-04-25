const express = require('express');
const router = express();

const {login, logout, mailRecoverPassword, auth} = require('../Controllers/auth.controller');



router.post('/login', login);
router.post('/logout', logout);
router.post('/mailRecoverPassword', mailRecoverPassword);
router.post('/verifyToken', auth);



module.exports = router;