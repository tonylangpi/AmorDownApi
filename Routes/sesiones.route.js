const express = require('express');
const router = express();
const upload = require('../services/multer.services');
const {allSesiones, createSesiones, updateSesiones, deleteSesiones} = require('../Controllers/sesiones.controller');


router.get('/',allSesiones);
router.post('/createSesion',createSesiones)
router.put('/updateSesion', updateSesiones);
router.delete('/deleteSesion', deleteSesiones);


module.exports = router;