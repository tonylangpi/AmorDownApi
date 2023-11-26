const {sequelize, connection} = require("../Database/bd");
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
//const subirArchivos = require('../Middleware/multer'); 


const allSesiones = async (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    const {} = req.body;
    connection.query('SELECT SB.ID_SESION_BENEFICIARIO, B.ID_BENEFICIARIO, CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BENEFICIARIO, CONCAT(SB.FECHA," ", SE.HORA_INGRESO, " a " , SE.HORA_EGRESO) AS FECHA, A.NOMBRE FROM SESIONES_BENEFICIARIO SB INNER JOIN BENEFICIARIO B ON B.ID_BENEFICIARIO = SB.ID_BENEFICIARIO INNER JOIN SESIONES SE ON SE.ID_SESION = SB.ID_SESION INNER JOIN USUARIOS US ON US.ID = SB.ID_USUARIO INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA WHERE A.ID_AREA = ? order by SE.HORA_INGRESO asc', [decoded.id_area], (error, results) => {
        if(error){
            console.log(error);
            
        }else{
            res.json(results);
        }
    })
}

const createSesiones = async (req, res) => {
    const {id_beneficiario, id_sesion, tipo_sesion,observacion, fecha, token} = req.body;
    const decoded = jwt.verify(token, process.env.SECRET);
    

    connection.query(`SELECT * FROM SESIONES_BENEFICIARIO WHERE ID_BENEFICIARIO = '${id_beneficiario}' AND FECHA = '${fecha}' AND ID_SESION = '${id_sesion}'`, (error, results) => {
        if(error){
            console.log(error);
        }else{
            if(results.length > 0){
                res.json({message: "Ya existe una cita para este beneficiario en esta fecha y hora"});
            }else{
    connection.query('INSERT INTO SESIONES_BENEFICIARIO SET ?', {ID_USUARIO:decoded.id,ID_SESION:id_sesion,ID_BENEFICIARIO:id_beneficiario, TIPO_SESION:tipo_sesion,DIRE_ARCHIVO:req?.file?.filename, OBSERVACION:observacion, FECHA:fecha},async (error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
            }
        }

    })
}

const updateSesiones = async (req, res) => {
    const {id_sesion_beneficiario, id_beneficiario, id_sesion, tipo_sesion,observacion, fecha, token} = req.body;
    const decoded = jwt.verify(token, process.env.SECRET);

    connection.query('UPDATE SESIONES_BENEFICIARIO SET ID_USUARIO = ?, ID_SESION = ?, ID_BENEFICIARIO = ?, TIPO_SESION = ?, OBSERVACION = ?, FECHA = ? WHERE ID_SESION_BENEFICIARIO = ?', [decoded.id ,id_sesion,id_beneficiario,tipo_sesion,observacion,fecha,id_sesion_beneficiario],async (error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
}

const deleteSesiones = async (req, res) => {
    const {id_sesion_beneficiario} = req.body;

    connection.query('DELETE FROM SESIONES_BENEFICIARIO WHERE ID_SESION_BENEFICIARIO = ?', [id_sesion_beneficiario],async (error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
}


const SesionesDisponibles = async (req, res) => {
    const {Beneficiario, Fecha} = req.body
    const Fechaa = Fecha || '2000-01-01'
    connection.query('SELECT S.ID_SESION, S.NUMERO_SESION, HORA_INGRESO, HORA_EGRESO FROM SESIONES S WHERE NOT EXISTS ( SELECT 1 FROM SESIONES_BENEFICIARIO SB WHERE SB.ID_SESION = S.ID_SESION AND SB.ID_BENEFICIARIO = ? AND SB.FECHA = ? )', [Beneficiario, Fechaa], (error, results) => {
        if(error){
            console.log(error);
            
        }else{
            res.json(results);
        }
    })
}



module.exports = {
    allSesiones,
    createSesiones,
    updateSesiones,
    deleteSesiones,
    SesionesDisponibles
}
