const express = require('express');
const router = express();
const usuarios = require('./usuarios.route');
const roles = require('./roles.route');
//this route will come with all comunidades
router.use('/usuarios',usuarios);
router.use('/roles', roles );

module.exports = router; 