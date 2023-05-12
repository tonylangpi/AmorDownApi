const {sequelize,connection} = require("../Database/bd");


const sesionsForAreas = async(req,res) =>{

    const{idUsuario, idEmpresa} = req.params;
    const {fecha_desde, fecha_hasta} = req.body;
    try {
       if(fecha_desde == null && fecha_hasta == null){
        connection.query(`SELECT A.NOMBRE AS AREA, CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BEFICIARIO, SB.FECHA, CONCAT(\'SESION NO.\',S.NUMERO_SESION), S.HORA_INGRESO, S.HORA_EGRESO FROM SESIONES_BENEFICIARIO SB
        INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
         INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
        INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
        INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
        INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
        WHERE SB.ID_USUARIO = ${idUsuario}  AND E.ID_EMPRESA = ${idEmpresa} AND SB.FECHA >= '1000-01-01' AND SB.FECHA <= '9999-12-31'`, (error, results) => {
            if(error){
                console.log(error);
            }else{
                res.json(results);
            }
        })

       }else {
        connection.query(`SELECT A.NOMBRE AS AREA, CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BEFICIARIO, SB.FECHA, CONCAT(\'SESION NO.\',S.NUMERO_SESION), S.HORA_INGRESO, S.HORA_EGRESO FROM SESIONES_BENEFICIARIO SB
        INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
         INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
        INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
        INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
        INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
        WHERE SB.ID_USUARIO = ${idUsuario}  AND E.ID_EMPRESA = ${idEmpresa} AND SB.FECHA >= '${fecha_desde}'AND SB.FECHA <= '${fecha_hasta}'`, (error, results) => {
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
    const {idEmpresa} = req.params;
    const {idBeneficiario,fecha_desde,fecha_hasta} = req.body;
    try {
        if(fecha_desde == null || fecha_hasta == null){
            connection.query(`SELECT CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BEFICIARIO, B.SEXO, DATEDIFF(CURDATE(),FECHA_NACIMIENTO) / 365 AS EDAD, A.NOMBRE AS AREA_ATENDIO, SB.FECHA, CONCAT(\'SESION NO. \',S.NUMERO_SESION) AS SESION_ATENDIDA, CONCAT( S.HORA_INGRESO, \' a \', S.HORA_EGRESO) AS HORARIO_ATENDIDO FROM SESIONES_BENEFICIARIO SB
            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
            INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
            INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
            INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA WHERE SB.ID_BENEFICIARIO = ${idBeneficiario} AND E.ID_EMPRESA = ${idEmpresa} AND SB.FECHA >= '1000-01-01' AND SB.FECHA <= '9999-12-31'`, (error, results) => {
                if(error){
                    console.log(error);
                }else{
                    res.json(results);
                }
            })
        }else{
            connection.query(`SELECT CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BEFICIARIO, B.SEXO, DATEDIFF(CURDATE(),FECHA_NACIMIENTO) / 365 AS EDAD, A.NOMBRE AS AREA_ATENDIO, SB.FECHA, CONCAT(\'SESION NO. \',S.NUMERO_SESION) AS SESION_ATENDIDA, CONCAT( S.HORA_INGRESO, \' a \', S.HORA_EGRESO) AS HORARIO_ATENDIDO FROM SESIONES_BENEFICIARIO SB
            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
            INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
            INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
            INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA WHERE SB.ID_BENEFICIARIO = ${idBeneficiario} AND E.ID_EMPRESA = ${idEmpresa} AND SB.FECHA >= ' ${fecha_desde}' AND SB.FECHA <= ' ${fecha_hasta} '`, (error, results) => {
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
module.exports = {
    sesionsForAreas,
    sesionsForBeneficiary
}
