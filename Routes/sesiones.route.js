const express = require('express');
const router = express();
const {sesionesUpload} = require('../services/multer.services');
const {allSesiones, createSesiones, updateSesiones, deleteSesiones} = require('../Controllers/sesiones.controller');


router.get('/',allSesiones);
router.post('/createSesion',sesionesUpload.single('evaluaciones'),createSesiones)
router.put('/updateSesion', updateSesiones);
router.delete('/deleteSesion', deleteSesiones);


module.exports = router;