const express = require('express');
const router = express();
const {upload} = require('../services/multer.services');
const {createBeneficiarios,createPrenatalesBeneficiarios,createHistorialClinico,createPeriNatales,createPostNatales,createEncargados,unionBeneficiarioEncargado, allBeneficiarios, beneficiarioArea} = require('../Controllers/beneficiarios.controller');

router.post('/all', allBeneficiarios);
router.post('/create', upload.array('files', 2), createBeneficiarios);
router.post('/createPrenatales/:idbene', createPrenatalesBeneficiarios);
router.post('/createHistorialClinico/:idbene',createHistorialClinico);
router.post('/createPeriNatales/:idbene', createPeriNatales);
router.post('/createPostNatales/:idbene',createPostNatales);
router.post('/createEncargados/:idbene', createEncargados);
router.post('/unionBeneficiarioEncargado', unionBeneficiarioEncargado);
router.get('/beneficiariosPorArea/:area', beneficiarioArea);

module.exports = router;