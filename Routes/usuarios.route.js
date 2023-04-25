const express = require('express');
const router = express();

const {getUsers,getUser,getUserName, createUsers, getUsersAndRoles, updateUsers, updateUsersPassword, updateUsersRol, inactivateUsers} = require('../Controllers/usuarios.controller');

//rutas de CRUD sobre tabla USUARIOS EN BD EN LA NUBE
router.get('/',getUsers);
router.post('/user',getUser)
router.post('/userName',getUserName)
router.post('/create', createUsers);
router.put('/updateUsers', updateUsers);
router.put('/updateUsersPassword', updateUsersPassword);
router.put('/updateUsersRol', updateUsersRol);
router.put('/inactivateUsers', inactivateUsers);
router.get('/RolesAndUsers', getUsersAndRoles);

module.exports = router;