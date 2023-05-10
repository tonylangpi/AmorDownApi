const express = require('express');
const router = express();

const {sesionsForAreas,sesionsForBeneficiary } = require('../Controllers/reportes.controller');

//rutas para traer data de reportes en store procedures de base de datos
router.get('/sesionesPorArea/:idUsuario/:idEmpresa',sesionsForAreas);
router.get('/sesionesPorBeneficiario/:idEmpresa',sesionsForBeneficiary);
module.exports = router;