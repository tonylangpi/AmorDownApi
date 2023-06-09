const express = require('express');
const router = express();

const {getRoles, getRolID, createRoles, DeleteRoles, AddModulesToRoles, updateModulesToRoles, getAllRolesAndModules, modulesByRol, updateRoles} = require('../Controllers/roles.controller');

//rutas de CRUD sobre tabla ROLES EN BD EN LA NUBE
router.get('/',getRoles);
router.get('/getRolID/:idRol', getRolID);
router.post('/create', createRoles);
router.delete('/deleteRoles/:idRol', DeleteRoles);
router.put('/updateRoles', updateRoles);
router.post('/addRolModulo', AddModulesToRoles);
router.put('/updateRolModulo', updateModulesToRoles);
router.get('/getRolAndModules', getAllRolesAndModules); 
router.get('/modulesByRol/:idRol', modulesByRol); 

module.exports = router;