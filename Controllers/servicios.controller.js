const {sequelize, connection} = require("../Database/bd");
const { QueryTypes } = require('sequelize');
//const subirArchivos = require('../Middleware/multer'); 


const getServicios =  (req, res) => {
     connection.query('SELECT * FROM AREAS',(error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
}

const createServicios =  (req, res) => {
    const {NOMBRE} = req.body;
    connection.query('INSERT INTO AREAS SET ?',{NOMBRE},(error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
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
    const{ID_AREA} = req.params;
    connection.query('DELETE FROM AREAS WHERE ID_AREA = ?', [ID_AREA],async (error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
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
}
