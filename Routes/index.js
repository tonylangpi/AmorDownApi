const express = require('express');
const router = express();
const usuarios = require('./usuarios.route');
const roles = require('./roles.route');
const auth = require('./auth.route');
const beneficiarios = require('./beneficiarios.route');
const sesiones = require('./sesiones.route');
//this route will come with all comunidades
router.use('/usuarios',usuarios);
router.use('/roles', roles );
router.use('/auth', auth);
router.use('/beneficiarios', beneficiarios);
router.use('/sesiones', sesiones)

module.exports = router; 