const express = require('express');
const router = express();

const {sesionsForAreas,sesionsForBeneficiary,reporteCuantitativo, reporteF9 } = require('../Controllers/reportes.controller');

//rutas para traer data de reportes en store procedures de base de datos
router.get('/sesionesPorArea/:token/:fecha_desde/:fecha_hasta',sesionsForAreas);
router.get('/sesionesPorBeneficiario/:idBeneficiario/:token/:fecha_desde/:fecha_hasta',sesionsForBeneficiary);
router.get('/reporteCuantitativo',reporteCuantitativo);
router.get('/reporteF9',reporteF9);
module.exports = router;