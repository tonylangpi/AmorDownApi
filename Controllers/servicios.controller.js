const {sequelize, connection} = require("../Database/bd");
const { QueryTypes } = require('sequelize');
//const subirArchivos = require('../Middleware/multer'); 


const getServicios =  (req, res) => {
     connection.query(`SELECT * FROM AREAS`,(error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
}

const getServicioss =  (req, res) => {
    const {NOMBRE} = req.body;
     connection.query(`SELECT * FROM AREAS WHERE ESTADO = 1`,(error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
}

const createServicios =  (req, res) => {
    const {NOMBRE} = req.body;
    const ESTADO = 1;
    connection.query('INSERT INTO AREAS SET ?',{NOMBRE,ESTADO},(error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
}

const CreateEmpresa = (req, res) => {
    const {Nombre, Direccion, Telefono, Codigo} = req.body
    connection.query("INSERT INTO EMPRESA (NOMBRE, DIRECCION, TELEFONO, CODIGO) VALUES (?, ?, ?, ?)", [Nombre, Direccion, Telefono, Codigo], (error, result) => {
        if(error){
            console.log(error)
        } else {
            res.json({message:"Creada Correctamente"})
        }
    })
    
}

const updateServicios = async(req,res)=>{
    const{ID_AREA} = req.params;
    const {NOMBRE} = req.body;
    connection.query('UPDATE AREAS SET ? WHERE ID_AREA = ?', [{NOMBRE}, ID_AREA], (error, results) =>{
        if(error){
            console.log(error);
        }else{ 
            res.json({
                message: 'area  actualizada correctamente',
            });
        }
    });

}

const deleteServicios = (req, res) =>{ 
    const{Area, Estado} = req.body;
    console.log(Area, Estado)
    if(Estado === 1){
        connection.query('UPDATE AREAS SET ESTADO = 0 WHERE ID_AREA = ?', [Area],async (error, results) => {
            if(error){
                console.log(error);
            }else{
                res.json(results);
            }
        })
    } else if(Estado===0){
        connection.query('UPDATE AREAS SET ESTADO = 1 WHERE ID_AREA = ?', [Area],async (error, results) => {
            if(error){
                console.log(error);
            }else{
                res.json(results);
            }
        })
    }
    
}

const areaBeneficiarios = (req,res) => {
    const {ID_AREA, ID_BENEFICIARIO} = req.params;
    connection.query(`INSERT INTO BENEFICIARIO_AREAS(ID_BENEFICIARIO,ID_AREA,FECHA) VALUES(${ID_BENEFICIARIO},${ID_AREA},CURDATE())`,(error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
}


module.exports = {
    getServicios,
    createServicios,
    updateServicios,
    deleteServicios,
    areaBeneficiarios,
    getServicioss, 
    CreateEmpresa
}
