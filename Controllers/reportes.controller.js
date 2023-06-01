const {sequelize,connection} = require("../Database/bd");
const jwt = require('jsonwebtoken');

const sesionsForAreas = async(req,res) =>{

    const{fecha_desde, fecha_hasta} = req.params;
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    const {} = req.body;
    try {
       if(fecha_desde == null && fecha_hasta == null){
        connection.query(`SELECT A.NOMBRE AS AREA, CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BENEFICIARIO, SB.FECHA, CONCAT(\'SESION NO.\',S.NUMERO_SESION) AS SESIONES, S.HORA_INGRESO, S.HORA_EGRESO FROM SESIONES_BENEFICIARIO SB
        INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
         INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
        INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
        INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
        INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
        WHERE SB.ID_USUARIO = ${decoded.id}  AND E.ID_EMPRESA = ${decoded.id_empresa} AND SB.FECHA >= '1000-01-01' AND SB.FECHA <= '9999-12-31'`, (error, results) => {
            if(error){
                console.log(error);
            }else{
                res.json(results);
            }
        })

       }else {
        connection.query(`SELECT A.NOMBRE AS AREA, CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BENEFICIARIO, SB.FECHA, CONCAT(\'SESION NO.\',S.NUMERO_SESION) AS SESIONES, S.HORA_INGRESO, S.HORA_EGRESO FROM SESIONES_BENEFICIARIO SB
        INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
         INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
        INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
        INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
        INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
        WHERE SB.ID_USUARIO = ${decoded.id}  AND E.ID_EMPRESA = ${decoded.id_empresa} AND SB.FECHA >= '${fecha_desde}'AND SB.FECHA <= '${fecha_hasta}'`, (error, results) => {
            if(error){
                console.log(error);
            }else{
                res.json(results);
            }
        })
       }
       
    } catch (error) {
        res.json(error);
    }
}

const sesionsForBeneficiary = async(req,res) =>{
    const {idBeneficiario,fecha_desde,fecha_hasta} = req.params;
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    
    // const {} = req.body;
    try {
        if(fecha_desde == null || fecha_hasta == null){
            connection.query(`SELECT CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BENEFICIARIO, B.SEXO, DATEDIFF(CURDATE(),FECHA_NACIMIENTO) / 365 AS EDAD, A.NOMBRE AS AREA_ATENDIO, SB.FECHA, CONCAT(\'SESION NO. \',S.NUMERO_SESION) AS SESION_ATENDIDA, CONCAT( S.HORA_INGRESO, \' a \', S.HORA_EGRESO) AS HORARIO_ATENDIDO FROM SESIONES_BENEFICIARIO SB
            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
            INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
            INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
            INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA WHERE SB.ID_BENEFICIARIO = ${idBeneficiario} AND E.ID_EMPRESA = ${decoded.id_empresa} AND SB.FECHA >= '1000-01-01' AND SB.FECHA <= '9999-12-31'`, (error, results) => {
                if(error){
                    console.log(error);
                }else{
                    res.json(results);
                }
            })
        }else{
            connection.query(`SELECT CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BENEFICIARIO, B.SEXO, DATEDIFF(CURDATE(),FECHA_NACIMIENTO) / 365 AS EDAD, A.NOMBRE AS AREA_ATENDIO, SB.FECHA, CONCAT(\'SESION NO. \',S.NUMERO_SESION) AS SESION_ATENDIDA, CONCAT( S.HORA_INGRESO, \' a \', S.HORA_EGRESO) AS HORARIO_ATENDIDO FROM SESIONES_BENEFICIARIO SB
            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
            INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
            INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
            INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA WHERE SB.ID_BENEFICIARIO = ${idBeneficiario} AND E.ID_EMPRESA = ${decoded.id_empresa} AND SB.FECHA >= ' ${fecha_desde}' AND SB.FECHA <= ' ${fecha_hasta} '`, (error, results) => {
                if(error){
                    console.log(error);
                }else{
                    res.json(results);
                }
            })
        }
        
    } catch (error) {
        res.json(error);
    }
}

const reporteCuantitativo = (req,res) =>{
    const{desde, hasta} = req.body; 
    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;//regex para validar que la fecha venga año mes dia.
    try {
      if(formatoFecha.test(desde) && formatoFecha.test(hasta)){
        connection.query(`
        SELECT 
        CONCAT(B.NOMBRE1, ' ', B.NOMBRE2)AS NOMBRES,
        CONCAT(B.APELLIDO1, ' ', B.APELLIDO2, ' ') AS APELLIDOS, 
        B.SEXO, 
        TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, 
        CURDATE()) AS EDAD,
        CASE 
        WHEN TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) > 18 THEN 'ADULTO'
        ELSE 'NIÑO'  
        END AS 'CLASIFICACION',
        HC.DIAGNOSTICO, HC.DISCAPACIDAD, COUNT(SB.ID_SESION_BENEFICIARIO) AS ASISTENCIA
        FROM SESIONES_BENEFICIARIO SB
        INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
        INNER JOIN HISTORIAL_CLINICO HC ON B.ID_BENEFICIARIO = HC.ID_BENEFICIARIO 
        WHERE SB.FECHA >= ? AND SB.FECHA <= ?
        GROUP BY NOMBRES, APELLIDOS, B.SEXO, EDAD, CLASIFICACION, DIAGNOSTICO, DISCAPACIDAD `,[desde,hasta], (error,results) =>{
            if(error){
                console.log(error);
            }else{
                res.json(results);
            }
        });
      }else{
        res.json({mensaje:"formato de fecha incorrecto"});
      }
       
    } catch (error) {
        res.send(error); 
    }
}
const reporteF9 = (req,res) =>{
     const{desde, hasta} = req.body; 
    const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;//regex para validar que la fecha venga año mes dia.
    try {
        connection.query(`
        CREATE TEMPORARY TABLE IF NOT EXISTS INFORME AS (
            SELECT SB.FECHA, 
            B.REFERENCIA, 
            CONCAT(B.NOMBRE1, ' ', B.NOMBRE2) AS NOMBRES,
            CONCAT(B.APELLIDO1, ' ', B.APELLIDO2, ' ') AS APELLIDOS, 
            B.DIRECCION, 
            B.SEXO,
            TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD, 
            HC.DISCAPACIDAD, 
            B.ESCOLARIDAD, 
            SB.TIPO_SESION, 
            HC.DIAGNOSTICO, 
            A.NOMBRE AS SERVICIO_RECIBIDO
            FROM SESIONES_BENEFICIARIO SB
            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
            INNER JOIN HISTORIAL_CLINICO HC ON B.ID_BENEFICIARIO = HC.ID_BENEFICIARIO 
            INNER JOIN USUARIOS U ON SB.ID_USUARIO = U.ID
            INNER JOIN AREAS_USUARIOS AU ON U.ID = ID_USUARIO
            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
            GROUP BY FECHA, REFERENCIA, NOMBRES, APELLIDOS, DIRECCION, SEXO, EDAD, DISCAPACIDAD, ESCOLARIDAD,TIPO_SESION, DIAGNOSTICO, SERVICIO_RECIBIDO)
        `,(error,results) =>{
            if(error){
                console.log(error);
            }else{
                if(formatoFecha.test(desde) && formatoFecha.test(hasta)){
                    connection.query(`
                        SELECT 
                        GROUP_CONCAT(DAY(FECHA) SEPARATOR ', ') AS FECHA_DIAS,
                        REFERENCIA, 
                        NOMBRES, 
                        APELLIDOS, 
                        DIRECCION, 
                        SEXO, 
                        EDAD, 
                        DISCAPACIDAD, 
                        ESCOLARIDAD, 
                        GROUP_CONCAT(TIPO_SESION SEPARATOR ', ') AS TIPO_SESION,
                        DIAGNOSTICO, 
                        GROUP_CONCAT(SERVICIO_RECIBIDO SEPARATOR ', ') AS SERVICIO_RECIBIDO  
                        FROM INFORME
                        WHERE FECHA >= ? AND FECHA <= ?
                        GROUP BY NOMBRES,REFERENCIA, APELLIDOS, DIRECCION, SEXO, EDAD, DISCAPACIDAD, ESCOLARIDAD, DIAGNOSTICO `,[desde,hasta], (error,results) =>{
                        if(error){
                            console.log(error);
                        }else{
                            res.json(results);
                        }
                    });
                  }else{
                    res.json({mensaje:"formato de fecha incorrecto"});
                  }
            }
        });
    } catch (error) {
        res.send(error); 
    }
}

module.exports = {
    sesionsForAreas,
    sesionsForBeneficiary,
    reporteCuantitativo,
    reporteF9
}
