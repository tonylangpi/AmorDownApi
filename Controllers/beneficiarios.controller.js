const { sequelize, connection } = require("../Database/bd");
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
//const subirArchivos = require('../Middleware/multer'); 


const createBeneficiarios = async (req, res) => {

    const { token, NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, ESCOLARIDAD, SEXO, FECHA_NACIMIENTO, DIRECCION, REFERENCIA, NUMERO_HERMANOS, NUMERO_OCUPA } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET);
    
    try {
        await sequelize.query(`INSERT INTO BENEFICIARIO (ID_EMPRESA,NOMBRE1,NOMBRE2,NOMBRE3,APELLIDO1,APELLIDO2,ESCOLARIDAD,SEXO,FECHA_NACIMIENTO,FECHA_INGRESO,DIRECCION,REFERENCIA,ESTADO,NUMERO_HERMANOS,NUMERO_OCUPA,RUTA_ARCH1,RUTA_ARCH2) VALUES (${decoded.id_empresa},'${NOMBRE1}','${NOMBRE2}','${NOMBRE3}','${APELLIDO1}','${APELLIDO2}',
      '${ESCOLARIDAD}','${SEXO}','${FECHA_NACIMIENTO}',CURDATE(),'${DIRECCION}','${REFERENCIA}', 'ACTIVO', ${NUMERO_HERMANOS},${NUMERO_OCUPA},'${req?.files[0]?.filename}','${req?.files[1]?.filename}')`, { type: QueryTypes.INSERT });

        const id = await sequelize.query(`SELECT LAST_INSERT_ID() AS ID_BENE_INGRESADO`,
            { type: QueryTypes.SELECT });

        res.json({
            message: 'Beneficiario creado satisfactoriamente',
            idBeneficiario: id
        });
    } catch (error) {
        res.json(error);
    }
}

const createPrenatalesBeneficiarios = async (req, res) => {
    const { EMBARAZO_TERMINO, EXPLIQUE_EMBARAZO, PARTO_NORMAL, EXPLIQUE_PARTO, COMPLICACIONES, EXPLIQUE_COMPLICACION } = req.body;
    const { idbene } = req.params;
    try {
        await sequelize.query(`INSERT INTO PRE_NATALES(ID_BENEFICIARIO,EMBARAZO_TERMINO,EXPLIQUE_EMBARAZO,PARTO_NORMAL,EXPLIQUE_PARTO,COMPLICACIONES,EXPLIQUE_COMPLICACION) VALUES(${idbene},'${EMBARAZO_TERMINO}', '${EXPLIQUE_EMBARAZO}','${PARTO_NORMAL}','${EXPLIQUE_PARTO}','${COMPLICACIONES}','${EXPLIQUE_COMPLICACION}')`, { type: QueryTypes.INSERT });
        res.json({ message: "información prenatal de beneficiario agregada correctamente" });
    } catch (error) {
        res.json(error);
    }
}

const createHistorialClinico = async (req, res) => {
    const { ENFERMEDAD_PADECE, MEDICAMENTOS_INGIERE, VACUNAS, AUDICION, ORFTAMOLOGICAS, APARATO_AUDITIVO, LENTES, CIRUJIAS, OTRAS, DIAGNOSTICO, DISCAPACIDAD } = req.body;
    const { idbene } = req.params;
    try {
        await sequelize.query(`INSERT INTO HISTORIAL_CLINICO(ID_BENEFICIARIO,ENFERMEDAD_PADECE,MEDICAMENTOS_INGIERE,VACUNAS,AUDICION,ORFTAMOLOGICAS,APARATO_AUDITIVO,LENTES,CIRUJIAS,OTRAS,DIAGNOSTICO,DISCAPACIDAD) VALUES(${idbene},'${ENFERMEDAD_PADECE}','${MEDICAMENTOS_INGIERE}','${VACUNAS}','${AUDICION}','${ORFTAMOLOGICAS}','${APARATO_AUDITIVO}','${LENTES}','${CIRUJIAS}','${OTRAS}','${DIAGNOSTICO}','${DISCAPACIDAD}')`, { type: QueryTypes.INSERT });
        res.json({ message: "información de historial clinico agregada correctamente" });
    } catch (error) {
        res.json(error);
    }
}

const createPeriNatales = async (req, res) => {
    const { LLORO_INMEDIATAMENTE, COLORACION, INCUBADORA, COLOR } = req.body;
    const { idbene } = req.params;
    try {
        await sequelize.query(`INSERT INTO PERI_NATALES(ID_BENEFICIARIO,LLORO_INMEDIATAMENTE,COLORACION,INCUBADORA,COLOR) VALUES(${idbene},'${LLORO_INMEDIATAMENTE}','${COLORACION}','${INCUBADORA}','${COLOR}')`, { type: QueryTypes.INSERT });
        res.json({ message: "información perinatal agregada al beneficiario correctamente" });
    } catch (error) {
        res.json(error);
    }
}

const createPostNatales = async (req, res) => {
    const { TRATAMIENTO, INFECCIONES, FIEBRE, CONVULCIONES, LENGUAJE, CAMINA, OBSERVACIONES } = req.body;
    const { idbene } = req.params;
    try {
        await sequelize.query(`INSERT INTO POST_NATALES(ID_BENEFICIARIO,TRATAMIENTO,INFECCIONES,FIEBRE,CONVULCIONES,LENGUAJE,CAMINA,OBSERVACIONES) VALUES(${idbene},'${TRATAMIENTO}','${INFECCIONES}','${FIEBRE}','${CONVULCIONES}','${LENGUAJE}','${CAMINA}','${OBSERVACIONES}')`, { type: QueryTypes.INSERT });
        res.json({ message: "información postNatal agregada al beneficiario correctamente" });
    } catch (error) {
        res.json(error);
    }
}
const createEncargados = async (req, res) => {
    const { NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, TELEFONO, TIPO, ESCOLARIDAD, OCUPACION, FECHA_NACIMIENTO } = req.body;
    try {
        await sequelize.query(`INSERT INTO ENCARGADO (NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, TELEFONO, TIPO,ESCOLARIDAD, OCUPACION,FECHA_NACIMIENTO) VALUES ('${NOMBRE1}','${NOMBRE2}','${NOMBRE3}','${APELLIDO1}','${APELLIDO2}','${TELEFONO}','${TIPO}','${ESCOLARIDAD}','${OCUPACION}','${FECHA_NACIMIENTO}')`, { type: QueryTypes.INSERT });
        const { idbene } = req.params;
        const idEncargado = await sequelize.query(`SELECT LAST_INSERT_ID() AS ID_ENCARGADO_INGRESADO`,
            { type: QueryTypes.SELECT });
        await sequelize.query(`INSERT INTO BENEFICIARIO_ENCARGADO(ID_BENEFICIARIO,ID_ENCARGADO) VALUES(${idbene},${idEncargado[0].ID_ENCARGADO_INGRESADO})`, { type: QueryTypes.INSERT });

        res.json({
            message: "Encargado agregado correctamente"
        });
    } catch (error) {
        res.json(error);
    }
}

const unionBeneficiarioEncargado = async (req, res) => {
    const { ID_BENEFICIARIO, ID_ENCARGADO } = req.body;
    try {
        await sequelize.query(`INSERT INTO BENEFICIARIO_ENCARGADO(ID_BENEFICIARIO,ID_ENCARGADO) VALUES(${ID_BENEFICIARIO},${ID_ENCARGADO})`, { type: QueryTypes.INSERT });
        res.json({ message: "Encargado agregado a Beneficiario correctamente" });
    } catch (error) {
        res.json(error);
    }
}

const allBeneficiarios = async (req, res) => {
    try {
        const beneficiarios = await sequelize.query(`SELECT * FROM BENEFICIARIO`, { type: QueryTypes.SELECT });
        res.json(beneficiarios);
    } catch (error) {
        res.json(error)
    }

}
const allByName = (req, res) => {
    const { nombre } = req.body;
    connection.query(`SELECT * FROM BENEFICIARIO WHERE CONCAT(NOMBRE1, ' ' ,NOMBRE2, ' ' ,APELLIDO1, ' ' ,APELLIDO2) LIKE '%${nombre}%'`, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    })
}
const beneficiarioArea = (req, res) => {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.SECRET);
    connection.query('SELECT B.ID_BENEFICIARIO, B.NOMBRE1 AS NOMBRE, B.APELLIDO1 AS APELLIDO, A.NOMBRE AS AREA FROM BENEFICIARIO B INNER JOIN BENEFICIARIO_AREAS BA ON BA.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN AREAS A ON A.ID_AREA = BA.ID_AREA WHERE A.NOMBRE = ? ', [decoded.nombre_area], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    })

}
const updateInfoBene = (req, res) => {
    const { NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, ESCOLARIDAD, SEXO, FECHA_NACIMIENTO, DIRECCION, REFERENCIA, NUMERO_HERMANOS, NUMERO_OCUPA } = req.body;
    const { idBene } = req.params;

    connection.query('UPDATE BENEFICIARIO SET NOMBRE1 = ?, NOMBRE2 = ?, NOMBRE3= ?, APELLIDO1 = ?, APELLIDO2 = ?, ESCOLARIDAD = ?, SEXO = ?,FECHA_NACIMIENTO = ?, DIRECCION = ?, REFERENCIA = ?, NUMERO_HERMANOS =  ?, NUMERO_OCUPA = ? WHERE ID_BENEFICIARIO = ?', [NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, ESCOLARIDAD, SEXO, FECHA_NACIMIENTO, DIRECCION, REFERENCIA, NUMERO_HERMANOS, NUMERO_OCUPA, idBene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json("Info General del beneficiario actualizada correctamente");
        }
    })
}

const updateInfoBeneHistorialClinico = (req, res) => {
    const { ENFERMEDAD_PADECE, MEDICAMENTOS_INGIERE, VACUNAS, AUDICION, ORFTAMOLOGICAS, APARATO_AUDITIVO, LENTES, CIRUJIAS, OTRAS, DIAGNOSTICO, DISCAPACIDAD } = req.body;
    const { idBene } = req.params;
    connection.query('UPDATE HISTORIAL_CLINICO SET ENFERMEDAD_PADECE = ?, MEDICAMENTOS_INGIERE = ?,VACUNAS = ?, AUDICION = ?, ORFTAMOLOGICAS = ?, APARATO_AUDITIVO = ?, LENTES = ?, CIRUJIAS = ?, OTRAS = ?, DIAGNOSTICO = ?, DISCAPACIDAD = ?  WHERE ID_BENEFICIARIO = ?', [ENFERMEDAD_PADECE, MEDICAMENTOS_INGIERE, VACUNAS, AUDICION, ORFTAMOLOGICAS, APARATO_AUDITIVO, LENTES, CIRUJIAS, OTRAS, DIAGNOSTICO, DISCAPACIDAD, idBene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json("Historial Actualizado Correctamente");
        }
    });

}

const updateInfoBenePrenatales = (req, res) => {
    const { EMBARAZO_TERMINO, EXPLIQUE_EMBARAZO, PARTO_NORMAL, EXPLIQUE_PARTO, COMPLICACIONES, EXPLIQUE_COMPLICACION } = req.body;
    const { idBene } = req.params;
    connection.query('UPDATE PRE_NATALES SET EMBARAZO_TERMINO = ?, EXPLIQUE_EMBARAZO = ?, PARTO_NORMAL = ?, EXPLIQUE_PARTO = ?, COMPLICACIONES = ?, EXPLIQUE_COMPLICACION = ? WHERE ID_BENEFICIARIO = ?', [EMBARAZO_TERMINO, EXPLIQUE_EMBARAZO, PARTO_NORMAL, EXPLIQUE_PARTO, COMPLICACIONES, EXPLIQUE_COMPLICACION, idBene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}

const updateInfoBenePeriNatales = async (req, res) => {
    const { LLORO_INMEDIATAMENTE, COLORACION, INCUBADORA, COLOR } = req.body;
    const { idbene } = req.params;
    connection.query('UPDATE PERI_NATALES SET LLORO_INMEDIATAMENTE = ?,COLORACION = ?,INCUBADORA = ?,COLOR = ? WHERE ID_BENEFICIARIO = ?', [LLORO_INMEDIATAMENTE, COLORACION, INCUBADORA, COLOR, idbene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}

const updateInfoBenePostNatal = (req, res) => {
    const { TRATAMIENTO, INFECCIONES, FIEBRE, CONVULCIONES, LENGUAJE, CAMINA, OBSERVACIONES } = req.body;
    const { idbene } = req.params;
    connection.query('UPDATE POST_NATALES SET TRATAMIENTO = ?,INFECCIONES = ?,FIEBRE = ?,CONVULCIONES = ?,LENGUAJE = ?,CAMINA = ?,OBSERVACIONES = ? WHERE ID_BENEFICIARIO = ?', [TRATAMIENTO, INFECCIONES, FIEBRE, CONVULCIONES, LENGUAJE, CAMINA, OBSERVACIONES, idbene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}

const updateInfoBeneEncargado = (req, res) => {
    const { NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, TELEFONO, TIPO, ESCOLARIDAD, OCUPACION, FECHA_NACIMIENTO } = req.body;
    const { idEncargado } = req.params;
    connection.query('UPDATE ENCARGADO SET NOMBRE1 = ?, NOMBRE2 = ?, NOMBRE3 = ?, APELLIDO1 = ?, APELLIDO2 = ?, TELEFONO = ?, TIPO = ?,ESCOLARIDAD = ?, OCUPACION = ?, FECHA_NACIMIENTO = ? WHERE ID_ENCARGADO = ?', [NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, TELEFONO, TIPO, ESCOLARIDAD, OCUPACION, FECHA_NACIMIENTO, idEncargado], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });

}
const buscarEncargadoBene = (req, res) => {
    const { idBene } = req.params;
    connection.query(`SELECT 
    E.ID_ENCARGADO,
    E.NOMBRE1, 
    E.NOMBRE2, 
    E.NOMBRE3, 
    E.APELLIDO1,
     E.APELLIDO2, 
     E.TELEFONO, 
     E.TIPO,
     E.ESCOLARIDAD, 
     E.OCUPACION,
     E.FECHA_NACIMIENTO
     FROM BENEFICIARIO_ENCARGADO BE 
    INNER JOIN BENEFICIARIO B ON B.ID_BENEFICIARIO = BE.ID_BENEFICIARIO
    INNER JOIN ENCARGADO E ON E.ID_ENCARGADO = BE.ID_ENCARGADO
    WHERE BE.ID_BENEFICIARIO = ? `, [idBene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}

const buscarHistorialClinicoBene = (req, res) => {
    const { idBene } = req.params;
    connection.query(`SELECT 
    C.ENFERMEDAD_PADECE,
    C.MEDICAMENTOS_INGIERE,
    C.VACUNAS,
    C.AUDICION,
    C.ORFTAMOLOGICAS,
    C.APARATO_AUDITIVO,
    C.LENTES,
    C.CIRUJIAS,
    C.OTRAS,
    C.DIAGNOSTICO,
    C.DISCAPACIDAD
     FROM HISTORIAL_CLINICO C
    INNER JOIN BENEFICIARIO B ON B.ID_BENEFICIARIO = C.ID_BENEFICIARIO
    WHERE C.ID_BENEFICIARIO = ?`, [idBene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}
const buscarPrenatalesBene = (req, res) => {
    const { idBene } = req.parmas;
    connection.query(`SELECT 
    PRE.EMBARAZO_TERMINO,
    PRE.EXPLIQUE_EMBARAZO,
    PRE.PARTO_NORMAL,
    PRE.EXPLIQUE_PARTO,
    PRE.COMPLICACIONES,
    PRE.EXPLIQUE_COMPLICACION
     FROM PRE_NATALES PRE
    INNER JOIN BENEFICIARIO B ON B.ID_BENEFICIARIO = PRE.ID_BENEFICIARIO
    WHERE PRE.ID_BENEFICIARIO = ?`, [idBene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}

const buscarPerinatalesBene = (req, res) => {
    const { idBene } = req.params;
    connection.query(`SELECT
    PERI.LLORO_INMEDIATAMENTE,
    PERI.COLORACION,
    PERI.INCUBADORA,
    PERI.COLOR 
    FROM PERI_NATALES PERI
    INNER JOIN BENEFICIARIO B ON B.ID_BENEFICIARIO = PERI.ID_BENEFICIARIO
    WHERE PERI.ID_BENEFICIARIO = ?`, [idBene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}

const buscarPostNatalesBene = (req, res) => {
    const { idBene } = req.params;
    connection.query(`SELECT
    POST.TRATAMIENTO,
    POST.INFECCIONES,
    POST.FIEBRE,
    POST.CONVULCIONES,
    POST.LENGUAJE,
    POST.CAMINA,
    POST.OBSERVACIONES
    FROM POST_NATALES POST
    INNER JOIN BENEFICIARIO B ON B.ID_BENEFICIARIO = POST.ID_BENEFICIARIO
    WHERE POST.ID_BENEFICIARIO = ?`, [idBene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}

const inactivarBeneficiario = (req, res) => {
    const { idBene } = req.params;
    connection.query(`UPDATE BENEFICIARIO SET ESTADO = 'INACTIVO' WHERE ID_BENEFICIARIO = ?`, [idBene], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    });
}
module.exports = {
    createBeneficiarios,
    createPrenatalesBeneficiarios,
    createHistorialClinico,
    createPeriNatales,
    createPostNatales,
    createEncargados,
    unionBeneficiarioEncargado,
    allBeneficiarios,
    beneficiarioArea,
    allByName,
    updateInfoBene,
    updateInfoBeneHistorialClinico,
    updateInfoBenePrenatales,
    updateInfoBenePeriNatales,
    updateInfoBenePostNatal,
    updateInfoBeneEncargado,
    buscarEncargadoBene,
    buscarHistorialClinicoBene,
    buscarPrenatalesBene,
    buscarPerinatalesBene,
    buscarPostNatalesBene,
    inactivarBeneficiario,
}
