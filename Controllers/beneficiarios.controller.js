const {sequelize, connection} = require("../Database/bd");
const { QueryTypes } = require('sequelize');
//const subirArchivos = require('../Middleware/multer'); 


const createBeneficiarios = async(req, res) => {

    const{ID_EMPRESA, NOMBRE1,NOMBRE2,NOMBRE3,APELLIDO1,APELLIDO2,ESCOLARIDAD,SEXO,FECHA_NACIMIENTO,DIRECCION,REFERENCIA,NUMERO_HERMANOS,NUMERO_OCUPA} = req.body;
    
    try {
      await sequelize.query(`INSERT INTO BENEFICIARIO (ID_EMPRESA,NOMBRE1,NOMBRE2,NOMBRE3,APELLIDO1,APELLIDO2,ESCOLARIDAD,SEXO,FECHA_NACIMIENTO,FECHA_INGRESO,DIRECCION,REFERENCIA,ESTADO,NUMERO_HERMANOS,NUMERO_OCUPA,RUTA_ARCH1,RUTA_ARCH2) VALUES (${ID_EMPRESA},'${NOMBRE1}','${NOMBRE2}','${NOMBRE3}','${APELLIDO1}','${APELLIDO2}',
      '${ESCOLARIDAD}','${SEXO}','${FECHA_NACIMIENTO}',CURDATE(),'${DIRECCION}','${REFERENCIA}', 'ACTIVO', ${NUMERO_HERMANOS},${NUMERO_OCUPA},'${req?.files[0]?.filename}','${req?.files[1]?.filename}')`,{type: QueryTypes.INSERT});

      const id = await sequelize.query(`SELECT LAST_INSERT_ID() AS ID_BENE_INGRESADO`, 
      {type:QueryTypes.SELECT});
      
      res.json({
          message: 'Beneficiario creado satisfactoriamente',
          idBeneficiario: id
      });
    } catch (error) {
        res.json(error);
    }
}

const createPrenatalesBeneficiarios = async(req, res) => {
    const {EMBARAZO_TERMINO, EXPLIQUE_EMBARAZO,PARTO_NORMAL,EXPLIQUE_PARTO,COMPLICACIONES,EXPLIQUE_COMPLICACION} = req.body;
    const{idbene} = req.params; 
    try {
        await sequelize.query(`INSERT INTO PRE_NATALES(ID_BENEFICIARIO,EMBARAZO_TERMINO,EXPLIQUE_EMBARAZO,PARTO_NORMAL,EXPLIQUE_PARTO,COMPLICACIONES,EXPLIQUE_COMPLICACION) VALUES(${idbene},'${EMBARAZO_TERMINO}', '${EXPLIQUE_EMBARAZO}','${PARTO_NORMAL}','${EXPLIQUE_PARTO}','${COMPLICACIONES}','${EXPLIQUE_COMPLICACION}')`,{type: QueryTypes.INSERT});
        res.json({message:"información prenatal de beneficiario agregada correctamente"});
    } catch (error) {
        res.json(error);
    }
}

const createHistorialClinico = async(req,res) =>{
    const {ENFERMEDAD_PADECE,MEDICAMENTOS_INGIERE,VACUNAS,AUDICION,ORFTAMOLOGICAS,APARATO_AUDITIVO,LENTES,CIRUJIAS,OTRAS} = req.body;
    const {idbene} = req.params;
    try {
        await sequelize.query(`INSERT INTO HISTORIAL_CLINICO(ID_BENEFICIARIO,ENFERMEDAD_PADECE,MEDICAMENTOS_INGIERE,VACUNAS,AUDICION,ORFTAMOLOGICAS,APARATO_AUDITIVO,LENTES,CIRUJIAS,OTRAS) VALUES(${idbene},'${ENFERMEDAD_PADECE}','${MEDICAMENTOS_INGIERE}','${VACUNAS}','${AUDICION}','${ORFTAMOLOGICAS}','${APARATO_AUDITIVO}','${LENTES}','${CIRUJIAS}','${OTRAS}')`, {type:QueryTypes.INSERT});
        res.json({message:"información de historial clinico agregada correctamente"}); 
    } catch (error) {
        res.json(error);
    }
}

const createPeriNatales = async(req,res) => {
    const{LLORO_INMEDIATAMENTE,COLORACION,INCUBADORA,COLOR} = req.body;
    const {idbene} = req.params;
    try {
        await sequelize.query(`INSERT INTO PERI_NATALES(ID_BENEFICIARIO,LLORO_INMEDIATAMENTE,COLORACION,INCUBADORA,COLOR) VALUES(${idbene},'${LLORO_INMEDIATAMENTE}','${COLORACION}','${INCUBADORA}','${COLOR}')`, {type:QueryTypes.INSERT});
        res.json({message:"información perinatal agregada al beneficiario correctamente"});
    } catch (error) {
        res.json(error);
    }
}

const createPostNatales = async(req,res) =>{
     const{TRATAMIENTO,INFECCIONES,FIEBRE,CONVULCIONES,LENGUAJE,CAMINA,OBSERVACIONES} = req.body; 
     const{idbene} = req.params;
    try {
        await sequelize.query(`INSERT INTO POST_NATALES(ID_BENEFICIARIO,TRATAMIENTO,INFECCIONES,FIEBRE,CONVULCIONES,LENGUAJE,CAMINA,OBSERVACIONES) VALUES(${idbene},'${TRATAMIENTO}','${INFECCIONES}','${FIEBRE}','${CONVULCIONES}','${LENGUAJE}','${CAMINA}','${OBSERVACIONES}')`,{type:QueryTypes.INSERT});
        res.json({message:"información postNatal agregada al beneficiario correctamente"});
    } catch (error) {
        res.json(error);
    }
}
const createEncargados = async(req,res) =>{
      const{NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, TELEFONO, TIPO,ESCOLARIDAD, OCUPACION,FECHA_NACIMIENTO} = req.body;
    try {
        await sequelize.query(`INSERT INTO ENCARGADO (NOMBRE1, NOMBRE2, NOMBRE3, APELLIDO1, APELLIDO2, TELEFONO, TIPO,ESCOLARIDAD, OCUPACION,FECHA_NACIMIENTO) VALUES ('${NOMBRE1}','${NOMBRE2}','${NOMBRE3}','${APELLIDO1}','${APELLIDO2}','${TELEFONO}','${TIPO}','${ESCOLARIDAD}','${OCUPACION}','${FECHA_NACIMIENTO}')`,{type: QueryTypes.INSERT});
        const {idbene} = req.params;
        const idEncargado = await sequelize.query(`SELECT LAST_INSERT_ID() AS ID_ENCARGADO_INGRESADO`, 
        {type:QueryTypes.SELECT});
        await sequelize.query(`INSERT INTO BENEFICIARIO_ENCARGADO(ID_BENEFICIARIO,ID_ENCARGADO) VALUES(${idbene},${idEncargado[0].ID_ENCARGADO_INGRESADO})`,{type:QueryTypes.INSERT});

        res.json({
            message:"Encargado agregado correctamente"
        });
    } catch (error) {
        res.json(error);
    }
}

const unionBeneficiarioEncargado = async (req,res) =>{
    const {ID_BENEFICIARIO,ID_ENCARGADO} = req.body;
    try {
        await sequelize.query(`INSERT INTO BENEFICIARIO_ENCARGADO(ID_BENEFICIARIO,ID_ENCARGADO) VALUES(${ID_BENEFICIARIO},${ID_ENCARGADO})`,{type:QueryTypes.INSERT});
        res.json({message:"Encargado agregado a Beneficiario correctamente"});
    } catch (error) {
        res.json(error);
    }
}

const allBeneficiarios = async(req,res) =>{
    try {
       const beneficiarios = await sequelize.query(`SELECT * FROM BENEFICIARIO`, {type: QueryTypes.SELECT});
        res.json({data:beneficiarios});
    } catch (error) {
        res.json(error)
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
}
