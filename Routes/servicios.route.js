const express = require('express');
const router = express();

const {getServicios,getServicioss,createServicios,updateServicios,deleteServicios,areaBeneficiarios} = require('../Controllers/servicios.controller');

//rutas de CRUD sobre tabla ROLES EN BD EN LA NUBE
router.post('/',getServicios);
router.post('/Areas',getServicioss);
router.post('/createServicios', createServicios);
router.put('/updateServicios/:ID_AREA', updateServicios);
router.post('/deleteServicios', deleteServicios);
router.post('/AddareaBeneficiarios/:ID_AREA/:ID_BENEFICIARIO',areaBeneficiarios);//ASIGNAR BENEFICIARIOS A AREAS


module.exports = router;