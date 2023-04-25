const {sequelize,connection} = require("../Database/bd");
const { QueryTypes } = require('sequelize');

const getRoles = async (req, res) => {
    connection.query('SELECT * FROM ROLES', (error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
}

const createRoles = async (req, res) =>{
    //ruta = /roles/create?nameRol=Terapeutas
    const {nameRol} = req.query; 
    try {
        await sequelize.query(`INSERT INTO ROLES (nombre_rol) VALUES ('${nameRol}')`,{type: QueryTypes.INSERT});
       res.json({data: "rol creado satisfactoriamente"});
    } catch (error) {
        res.json(error);
    }
}

const updateRoles = async (req, res) => {
    const {idRol, nameRolUpdate} = req.body; 
    try {
        await sequelize.query(`UPDATE ROLES SET nombre_rol = '${nameRolUpdate}' WHERE id_roles = ${idRol}`, {type:QueryTypes.UPDATE});
        res.json({data: "Rol Actualizado correctamente"});
    } catch (error) {
        res.json(error);
    }
}

const DeleteRoles = async (req,res) =>{
    const {idRol} = req.params; 
    try {
        const searchRol = await sequelize.query(`SELECT * FROM ROLES WHERE id_roles =${idRol}`);
        
        if(searchRol != null){
            await sequelize.query(`DELETE FROM ROLES WHERE id_roles = ${idRol}`, {type: QueryTypes.DELETE});
            res.json({data: "Se ha borrado el rol correctamente"}); 
        }else{
            res.json({data: "No se encontro el rol que se quiere borrar"}); 
        }
        
    } catch (error) {
        res.json(error);
    }
}

const AddModulesToRoles = async (req, res) =>{
    const {idRol, idModulo} = req.body;  
    try {
        await sequelize.query(`INSERT INTO ROLES_MODULOS (id_rol,id_modulo) VALUES (${idRol}, ${idModulo})`, {type: QueryTypes.INSERT}); 
        res.json({data:"Modulo Asignado Correctamente al rol"}); 
    } catch (error) {
        res.json(error);
    }
}

const updateModulesToRoles = async (req, res) =>{
    const {idRolAnterior, idModuloAnterior, idRolNuevo, idModuloNuevo} = req.body;  
    try {
        await sequelize.query(`UPDATE ROLES_MODULOS SET id_rol = ${idRolNuevo}, id_modulo = ${idModuloNuevo} WHERE id_rol = ${idRolAnterior} AND id_modulo = ${idModuloAnterior}`, {type: QueryTypes.UPDATE}); 
        res.json({data:"Rol y Modulo Editado correctamente"}); 
    } catch (error) {
        res.json(error);
    }
}

const getAllRolesAndModules = async (req,res) =>{
    try {
        const allModulesAndRoles = await sequelize.query('SELECT R.nombre_rol, M.nombre as Modulo, M.descripcion as Modulo_Descripcion FROM ROLES_MODULOS RM INNER JOIN ROLES R ON R.id_roles = RM.id_rol INNER JOIN MODULOS M ON  M.id_modulo = RM.id_modulo', {type: QueryTypes.SELECT}); 
        res.json({data: allModulesAndRoles}); 
    } catch (error) {
        res.json(error);
    }
}

const modulesByRol = async (req,res) => {
    const {idRol} = req.params; 
    try {
        const searchModulesByroles = await sequelize.query(`SELECT R.nombre_rol, M.nombre as Modulo, M.descripcion as Modulo_Descripcion FROM ROLES_MODULOS RM INNER JOIN ROLES R ON R.id_roles = RM.id_rol INNER JOIN MODULOS M ON  M.id_modulo = RM.id_modulo WHERE R.id_roles = ${idRol}`, {type: QueryTypes.SELECT}); 
        if(searchModulesByroles != null){
            res.json({data: searchModulesByroles});
        }else{
            res.json({data: "no se encontro modulos asociados a ese rol"}); 
        }
    } catch (error) {
        res.json(error); 
    }
}

module.exports = {
    getRoles,
    createRoles,
    DeleteRoles,
    AddModulesToRoles,
    updateModulesToRoles,
    getAllRolesAndModules,
    modulesByRol,
    updateRoles
}
