const express = require('express');
const router = express();
const upload = require('../services/multer.services');
const {createBeneficiarios,createPrenatalesBeneficiarios,createHistorialClinico,createPeriNatales,createPostNatales,createEncargados,unionBeneficiarioEncargado} = require('../Controllers/beneficiarios.controller');

router.post('/create', upload.array('files', 2), createBeneficiarios);
router.post('/createPrenatales', createPrenatalesBeneficiarios);
router.post('/createHistorialClinico',createHistorialClinico);
router.post('/createPeriNatales', createPeriNatales);
router.post('/createPostNatales',createPostNatales);
router.post('/createEncargados', createEncargados);
router.post('/unionBeneficiarioEncargado', unionBeneficiarioEncargado);

module.exports = router;