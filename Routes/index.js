const express = require('express');
const router = express();
const usuarios = require('./usuarios.route');
const roles = require('./roles.route');
const { sequelize, connection } = require("../Database/bd");

const auth = require('./auth.route');
const beneficiarios = require('./beneficiarios.route');
const sesiones = require('./sesiones.route');
const reportes = require('./reportes.route');
const servicios = require('./servicios.route');
//this route will come with all comunidades


const actividad = () => {
    connection.query("SELECT 1 + 1 AS RESULT", async (err, result) => {
        if(err) {
            console.log(err)
            return;
        } else {
            console.log("Estamos Funcionando Resultado: ")
            console.log(result)
        }
    })
}

setInterval(actividad, 3600000);

router.use('/usuarios',usuarios);
router.use('/roles', roles );
router.use('/auth', auth);
router.use('/beneficiarios', beneficiarios);
router.use('/sesiones', sesiones);
router.use('/reportes',reportes);
router.use('/servicios',servicios)

module.exports = router; 