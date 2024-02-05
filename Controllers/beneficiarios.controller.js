const { sequelize, connection } = require("../Database/bd");
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');


const createBeneficiarios = async (req, res) => {

    const { TOKEN, NOMBRES, APELLIDOS, ESCOLARIDAD, SEXO, FECHA_NACIMIENTO, DIRECCION, REFERENCIA, NUMERO_HERMANOS, NUMERO_OCUPA, CUI, PUEBLO, DEPARTAMENTO, MUNICIPIO, GRADO, ADECUACIONES, ECIVIL, PROGRAMA } = req.body;
    const decoded = jwt.verify(TOKEN, process.env.SECRET);

    connection.query('Select * from BENEFICIARIO WHERE NOMBRES = ? AND APELLIDOS = ? AND FECHA_NACIMIENTO = ? AND CUI = ?', [NOMBRES, APELLIDOS, FECHA_NACIMIENTO, CUI], async (error, results) => {
        if (error) {
            res.json(error);
        } else {
            if (results.length > 0) {
                res.json({
                    message: "El beneficiario ya existe",
                })
            } else {
    try {
        const [Correlativo] = await sequelize.query(`SELECT MAX(CORRELATIVO) AS CORRELATIVO FROM BENEFICIARIO WHERE ID_EMPRESA = '${decoded.id_empresa}' ORDER BY CORRELATIVO DESC LIMIT 1`, { type: QueryTypes.SELECT });
        const Corre = Correlativo.CORRELATIVO || 0
        const NuevoCorrelaitvo = parseInt(Corre) + 1 
        await sequelize.query(`INSERT INTO BENEFICIARIO (ID_EMPRESA,CUI,NOMBRES,APELLIDOS,ESCOLARIDAD,SEXO, PUEBLO,FECHA_NACIMIENTO,FECHA_INGRESO,DEPARTAMENTO,MUNICIPIO,DIRECCION,REFERENCIA,ESTADO,NUMERO_HERMANOS,NUMERO_OCUPA,RUTA_ARCH1,RUTA_ARCH2, CORRELATIVO, GRADO, ADECUACIONES, ECIVIL, PROGRAMA_SOCIAL) VALUES (${decoded.id_empresa},'${CUI}','${NOMBRES}','${APELLIDOS}', '${ESCOLARIDAD}','${SEXO}','${PUEBLO}','${FECHA_NACIMIENTO}',CURDATE(),'${DEPARTAMENTO}','${MUNICIPIO}','${DIRECCION}','${REFERENCIA}', 1, ${NUMERO_HERMANOS},${NUMERO_OCUPA},'${req?.files[0]?.filename}','${req?.files[1]?.filename}','${NuevoCorrelaitvo}','${GRADO}',${ADECUACIONES},'${ECIVIL}','${PROGRAMA}')`, { type: QueryTypes.INSERT });

        const id = await sequelize.query(`SELECT LAST_INSERT_ID() AS ID_BENE_INGRESADO`,
            { type: QueryTypes.SELECT });

        res.json({
            message: 'Beneficiario creado satisfactoriamente',
            idBeneficiario: id
        });

    } catch (error) {
        console.log(error)
        res.json(error);
    }
            }
        }
    });
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
    const { NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, TELEFONO, TIPO, ESCOLARIDAD, OCUPACION, FECHA_NACIMIENTO, CUI, ECIVIL } = req.body;
    try {
        await sequelize.query(`INSERT INTO ENCARGADO (CUI, NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, TELEFONO, TIPO,ESCOLARIDAD, OCUPACION, ECIVIL, FECHA_NACIMIENTO) VALUES ('${CUI}','${NOMBRE1}','${NOMBRE2}','${NOMBRE3}','${APELLIDO1}','${APELLIDO2}','${TELEFONO}','${TIPO}','${ESCOLARIDAD}','${OCUPACION}','${ECIVIL}','${FECHA_NACIMIENTO}')`, { type: QueryTypes.INSERT });
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
    const {sede} = req.body
    try {
        const beneficiarios = await sequelize.query(`
        SELECT 
        B.ID_BENEFICIARIO, 
        B.ID_EMPRESA, 
        E.CODIGO,
        B.CORRELATIVO,
        B.CUI,
        B.NOMBRES, 
        B.APELLIDOS,
        B.ESCOLARIDAD,
        B.SEXO,
        B.PUEBLO,
        B.FECHA_NACIMIENTO,
        FECHA_INGRESO,
        B.DEPARTAMENTO,
        B.MUNICIPIO,
        B.DIRECCION,
        B.REFERENCIA,
        B.ESTADO,
        B.NUMERO_HERMANOS,
        B.NUMERO_OCUPA,
        B.RUTA_ARCH1,
        B.RUTA_ARCH2,
        ROUND(DATEDIFF(CURDATE(),B.FECHA_NACIMIENTO)/365) AS EDAD,
          CASE
                WHEN DATEDIFF(CURDATE(), B.fecha_nacimiento) / 365 < 18 THEN 'Joven'
                WHEN DATEDIFF(CURDATE(), B.fecha_nacimiento) / 365 < 65 THEN 'Adulto'
                ELSE 'Mayor'
            END AS grupo_edad
         FROM BENEFICIARIO B
         INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE B.ID_EMPRESA = ${sede} `, { type: QueryTypes.SELECT });
        res.json(beneficiarios);
    } catch (error) {
        res.json(error)
    }

}

const updateInfoBene = (req, res) => {
    const { NOMBRES, APELLIDOS, ESCOLARIDAD, SEXO, FECHA_NACIMIENTO, DIRECCION, REFERENCIA, NUMERO_HERMANOS, NUMERO_OCUPA, CUI} = req.body;
    const { idBene } = req.params;

    connection.query('UPDATE BENEFICIARIO SET CUI = ?, NOMBRES= ?, APELLIDOS = ?, ESCOLARIDAD = ?, SEXO = ?, FECHA_NACIMIENTO = ?, DIRECCION = ?, REFERENCIA = ?, NUMERO_HERMANOS =  ?, NUMERO_OCUPA = ? WHERE ID_BENEFICIARIO = ?', [CUI, NOMBRES, APELLIDOS, ESCOLARIDAD, SEXO, FECHA_NACIMIENTO, DIRECCION, REFERENCIA, NUMERO_HERMANOS, NUMERO_OCUPA, idBene], (error, results) => {
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
     Date_Format(E.FECHA_NACIMIENTO, '%Y-%m-%d') as FECHA_NACIMIENTO
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
    const { idBene } = req.params;
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

const Asistencia = async (req, res) => {
    const {Beneficiario, Fecha} = req.body 
    connection.query('SELECT * FROM ASISTENCIA WHERE ID_BENEFICIARIO = ? AND FECHA = ?', [Beneficiario, Fecha], (err, result) => {
        if(err) {
            console.log(err)
        } else if(result.length >= 1){
            res.send({message: 'Este Beneficiario ya tiene asistencia'})
        } else { 
            connection.query('INSERT INTO ASISTENCIA (ID_BENEFICIARIO, FECHA) VALUES (?, ?)', [Beneficiario, Fecha], (err, result) =>{
                if(err) {
                    console.log(err)
                } else {
                    res.json({message:"Asistencia Agregada"})
                }
            })
        }
    })   
       
}

const AsistenciaFecha = async (req, res) => {
    const {Fecha, Sede} = req.body 

    connection.query("SELECT E.NOMBRE AS SUCURSAL, B.ID_BENEFICIARIO, B.NOMBRES, B.APELLIDOS, DATE(A.FECHA) AS FECHA FROM ASISTENCIA A INNER JOIN BENEFICIARIO B ON A.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE A.FECHA = ? AND B.ID_EMPRESA = ?", [Fecha, Sede], (err, result) => {
        if(err){
            console.log(err)
        } else {
            res.json(result)
        }
    })
}

const bitacoraBene = async (req, res) => {
    const {Estado, Beneficiario, Motivo, Usuario} = req.body
    
    if(Estado === 1) {
        connection.query("INSERT INTO BITACORA_BENE VALUES(?, ?, ?, ?)", [Beneficiario, 'Inactivando', Usuario, Motivo], (err, result) => {
            if(err){
                console.log(err)
            } else {
                connection.query("UPDATE BENEFICIARIO SET ESTADO = 2 WHERE ID_BENEFICIARIO = ?", [Beneficiario], (error, response) => {
                    if(error){
                        console.log(error)
                    } else {
                        res.json({message:"Se inactivo correctamente"})
                    }
                })
                
            }
        })
    } else if(Estado === 2){
        connection.query("INSERT INTO BITACORA_BENE VALUES(?, ?, ?, ?)", [Beneficiario, 'Activando', Usuario, Motivo], (err, result) => {
            if(err){
                console.log(err)
            } else {
                connection.query("UPDATE BENEFICIARIO SET ESTADO = 1 WHERE ID_BENEFICIARIO = ?", [Beneficiario], (error, response) => {
                    if(error){
                        console.log(error)
                    } else {
                        res.json({message:"Se activo correctamente"})
                    }
                })
                
            }
        })
    }
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
    Asistencia, 
    AsistenciaFecha, 
    bitacoraBene, 
}
