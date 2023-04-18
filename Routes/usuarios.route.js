const express = require('express');
const router = express();

const {getUsers, createUsers} = require('../Controllers/usuarios.controller');

//rutas de CRUD sobre tabla USUARIOS EN BD EN LA NUBE
router.get('/',getUsers);
router.post('/create', createUsers);

module.exports = router;