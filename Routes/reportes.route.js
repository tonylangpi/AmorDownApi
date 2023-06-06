const express = require('express');
const router = express();

const {sesionsForAreas,sesionsForBeneficiary,reporteCuantitativo,reporteEstadistico, reporteF9 ,reporteCualitativo, reporteInformeServicio,excelReporteCuantitativo,excelReporteF9,excelReporteEstadistico,excelReporteCualitativo,excelReporteInformeServicio} = require('../Controllers/reportes.controller');

//rutas para traer data de reportes en store procedures de base de datos
router.get('/sesionesPorArea/:token/:fecha_desde/:fecha_hasta',sesionsForAreas);
router.get('/sesionesPorBeneficiario/:idBeneficiario/:token/:fecha_desde/:fecha_hasta',sesionsForBeneficiary);
router.post('/reporteCuantitativo',reporteCuantitativo);
router.post('/reporteF9',reporteF9);
router.post('/reporteEstadistico',reporteEstadistico);
router.post('/reporteCualitativo',reporteCualitativo);
router.post('/reporteInformeServicio',reporteInformeServicio);
/*RUTAS PARA DESCARGAS DE INFORMES O REPORTES DE LOS 5 PEDIDOS POR AMOR DOWN */
router.post('/descargarReporteCuantitativo',excelReporteCuantitativo);
router.post('/descargarReporteF9',excelReporteF9);
router.post('/descargarReporteEstadistico',excelReporteEstadistico); 
router.post('/descargarReporteCualitativo',excelReporteCualitativo); 
router.post('/descargarReporteInformeServicios', excelReporteInformeServicio)
module.exports = router;