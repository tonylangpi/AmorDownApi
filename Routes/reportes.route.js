const express = require('express');
const router = express();

const {sesionsForAreas,sesionsForBeneficiary } = require('../Controllers/reportes.controller');

//rutas para traer data de reportes en store procedures de base de datos
router.get('/sesionesPorArea/:token/:fecha_desde/:fecha_hasta',sesionsForAreas);
router.get('/sesionesPorBeneficiario/:idBeneficiario/:token/:fecha_desde/:fecha_hasta',sesionsForBeneficiary);
module.exports = router;