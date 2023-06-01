const express = require('express');
const router = express();

const {sesionsForAreas,sesionsForBeneficiary,reporteCuantitativo,reporteEstadistico, reporteF9 ,reporteCualitativo, reporteInformeServicio} = require('../Controllers/reportes.controller');

//rutas para traer data de reportes en store procedures de base de datos
router.get('/sesionesPorArea/:token/:fecha_desde/:fecha_hasta',sesionsForAreas);
router.get('/sesionesPorBeneficiario/:idBeneficiario/:token/:fecha_desde/:fecha_hasta',sesionsForBeneficiary);
router.get('/reporteCuantitativo',reporteCuantitativo);
router.get('/reporteF9',reporteF9);
router.get('/reporteEstadistico',reporteEstadistico);
router.get('/reporteCualitativo',reporteCualitativo);
router.get('/reporteInformeServicio',reporteInformeServicio);
module.exports = router;