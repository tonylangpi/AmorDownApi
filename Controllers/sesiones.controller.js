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
    const {id_beneficiario, id_sesion, tipo_sesion, actividad, evolucion, area, acompanamiento, fecha, token} = req.body;
    const decoded = jwt.verify(token, process.env.SECRET);
    

    connection.query(`SELECT * FROM SESIONES_BENEFICIARIO SB INNER JOIN AREAS A ON SB.ID_AREA = A.ID_AREA WHERE SB.ID_BENEFICIARIO = '${id_beneficiario}' AND SB.FECHA = '${fecha}' AND SB.ID_SESION = '${id_sesion}' AND A.NOMBRE != 'Psicologia'`, (error, results) => {
        if(error){
            console.log(error);
        }else{
            if(results.length > 0){
                res.json({message: "Ya existe una cita para este beneficiario en esta fecha y hora"});
            }else{
                console.log(acompanamiento)
    connection.query('INSERT INTO SESIONES_BENEFICIARIO SET ?', {ID_USUARIO:decoded.id, ID_SESION:id_sesion, ID_BENEFICIARIO:id_beneficiario, TIPO_SESION:tipo_sesion, ACTIVIDAD:actividad, EVOLUCION:evolucion, DIRE_ARCHIVO:req?.file?.filename, ID_AREA:area, ACOMPAÑAMIENTO:acompanamiento, FECHA:fecha},async (error, results) => {
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
    const {Beneficiario, Fecha, token, Area} = req.body
    const decoded = jwt.verify(token, process.env.SECRET);
    const Fechaa = Fecha || '2000-01-01'
    if(Area ==="Psicologia") {
        connection.query('SELECT ID_SESION, NUMERO_SESION, HORA_INGRESO, HORA_EGRESO FROM SESIONES ', (error, results) => {
            if(error){
                console.log(error);
                
            }else{
                res.json(results);
            }
        })
    } else {
         connection.query('SELECT S.ID_SESION, S.NUMERO_SESION, HORA_INGRESO, HORA_EGRESO FROM SESIONES S WHERE NOT EXISTS ( SELECT 1 FROM SESIONES_BENEFICIARIO SB INNER JOIN AREAS A ON SB.ID_AREA = A.ID_AREA WHERE SB.ID_SESION = S.ID_SESION AND SB.ID_BENEFICIARIO = ? AND SB.FECHA = ? AND A.NOMBRE != "Psicologia")', [Beneficiario, Fechaa], (error, results) => {
        if(error){
            console.log(error);
            
        }else{
            res.json(results);
        }
    })
    }
    
}

const TusAreas = async (req, res) => {
    const {token} = req.body
    const decoded = jwt.verify(token, process.env.SECRET);
        connection.query('SELECT A.ID_AREA, A.NOMBRE AS AREA FROM AREAS_USUARIOS AU INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA WHERE AU.ID_USUARIOS = ? ',[decoded.id], (error, results) => {
            if(error){
                console.log(error);
                
            }else{
                res.json(results);
            }
        })
    
}

const TusSedes= async (req, res) => {
    const {Usuario} = req.body
        connection.query('SELECT EU.ID_EMPRESA, E.NOMBRE  FROM EMPRESA_USUARIO EU INNER JOIN EMPRESA E ON EU.ID_EMPRESA = E.ID_EMPRESA WHERE EU.ID_USUARIO = ? ',[Usuario], (error, results) => {
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
    SesionesDisponibles,
    TusAreas, 
    TusSedes
}
