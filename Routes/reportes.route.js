const express = require('express');
const router = express();

const {sesionsForAreas,sesionsForBeneficiary,reporteCuantitativo,reporteMiEstadistica, reporteF9, reporteF8, reporteCualitativo, reporteInformeServicio, Estadistica} = require('../Controllers/reportes.controller');

//rutas para traer data de reportes en store procedures de base de datos
router.post('/sesionesPorArea',sesionsForAreas);
router.post('/EvolucionPorBenefiario',sesionsForBeneficiary);
router.post('/reporteCuantitativo',reporteCuantitativo);
router.post('/reporteF9',reporteF9);
router.post('/reporteEstadistico',reporteMiEstadistica);
router.post('/reporteCualitativo',reporteCualitativo);
router.post('/reporteInformeServicio',reporteInformeServicio);
router.post('/reporteF8', reporteF8);
router.post('/reporteEstadisticoGeneral', Estadistica)
module.exports = router;