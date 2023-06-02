const express = require('express');
const router = express();

const {sesionsForAreas,sesionsForBeneficiary,reporteCuantitativo,reporteEstadistico, reporteF9 ,reporteCualitativo, reporteInformeServicio} = require('../Controllers/reportes.controller');

//rutas para traer data de reportes en store procedures de base de datos
router.get('/sesionesPorArea/:token/:fecha_desde/:fecha_hasta',sesionsForAreas);
router.get('/sesionesPorBeneficiario/:idBeneficiario/:token/:fecha_desde/:fecha_hasta',sesionsForBeneficiary);
router.post('/reporteCuantitativo',reporteCuantitativo);
router.post('/reporteF9',reporteF9);
router.post('/reporteEstadistico',reporteEstadistico);
router.post('/reporteCualitativo',reporteCualitativo);
router.post('/reporteInformeServicio',reporteInformeServicio);
module.exports = router;