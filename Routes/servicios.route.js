const express = require('express');
const router = express();

const {getServicios,createServicios,updateServicios,deleteServicios,areaBeneficiarios} = require('../Controllers/servicios.controller');

//rutas de CRUD sobre tabla ROLES EN BD EN LA NUBE
router.post('/',getServicios);
router.post('/createServicios', createServicios);
router.put('/updateServicios/:ID_AREA', updateServicios);
router.delete('/deleteServicios/:ID_AREA', deleteServicios);
router.post('/AddareaBeneficiarios/:ID_AREA/:ID_BENEFICIARIO',areaBeneficiarios);//ASIGNAR BENEFICIARIOS A AREAS


module.exports = router;