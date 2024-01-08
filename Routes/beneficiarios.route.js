const express = require('express');
const router = express();
const {upload} = require('../services/multer.services');
const {createBeneficiarios,Asistencia, AsistenciaFecha, createPrenatalesBeneficiarios,createHistorialClinico,createPeriNatales,createPostNatales,createEncargados,unionBeneficiarioEncargado, allBeneficiarios, beneficiarioArea,allByName,updateInfoBene,updateInfoBeneHistorialClinico,updateInfoBenePrenatales,updateInfoBenePeriNatales,updateInfoBenePostNatal,updateInfoBeneEncargado, buscarEncargadoBene,buscarHistorialClinicoBene,buscarPrenatalesBene,buscarPerinatalesBene,buscarPostNatalesBene, bitacoraBene} = require('../Controllers/beneficiarios.controller');

router.post('/all', allBeneficiarios);
router.post('/allByName', allByName);
router.post('/create', upload.array('files', 2), createBeneficiarios);
router.post('/createPrenatales/:idbene', createPrenatalesBeneficiarios);
router.post('/createHistorialClinico/:idbene',createHistorialClinico);
router.post('/createPeriNatales/:idbene', createPeriNatales);
router.post('/createPostNatales/:idbene',createPostNatales);
router.post('/createEncargados/:idbene', createEncargados);
router.post('/unionBeneficiarioEncargado', unionBeneficiarioEncargado);
router.get('/beneficiariosPorArea/:token', beneficiarioArea);
router.post('/updateInfoBeneGeneral/:idBene', updateInfoBene);
router.post('/updateInfoBeneHistorialClinico/:idBene', updateInfoBeneHistorialClinico);
router.post('/updateInfoBenePrenatales/:idBene', updateInfoBenePrenatales);
router.post('/updateInfoBenePerinatales/:idbene', updateInfoBenePeriNatales);
router.post('/updateInfoBenePostnatales/:idbene',updateInfoBenePostNatal);
router.post('/updateEncargadosBene/:idEncargado',updateInfoBeneEncargado);
router.get('/buscarEncargadoBene/:idBene',buscarEncargadoBene);
router.get('/buscarHistorialClinicoBene/:idBene',buscarHistorialClinicoBene);
router.get('/buscarPrenatalesBene/:idBene',buscarPrenatalesBene);
router.get('/buscarPerinatalesBene/:idBene',buscarPerinatalesBene);
router.get('/buscarPostNatalesBene/:idBene',buscarPostNatalesBene);
router.post('/AgregarAsistencia', Asistencia)
router.post('/ListarAsistencias', AsistenciaFecha)
router.post('/BitacoraBene', bitacoraBene)
module.exports = router;