const express = require('express');
const router = express();
const usuarios = require('./usuarios.route');
//this route will come with all comunidades
router.use('/usuarios',usuarios);
module.exports = router; 