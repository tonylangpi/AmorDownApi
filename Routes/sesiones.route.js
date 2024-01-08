const express = require('express');
const router = express();
const {sesionesUpload} = require('../services/multer.services');
const {allSesiones, createSesiones, updateSesiones, deleteSesiones, SesionesDisponibles, TusAreas, TusSedes} = require('../Controllers/sesiones.controller');


router.get('/AreaSesiones/:token',allSesiones);
router.post('/createSesion',sesionesUpload.single('evaluaciones'),createSesiones)
router.put('/updateSesion', updateSesiones);
router.delete('/deleteSesion', deleteSesiones);
router.post('/SesionesDisponibles', SesionesDisponibles)
router.post('/TusAreas', TusAreas)
router.post('/TusSedes', TusSedes)

module.exports = router;