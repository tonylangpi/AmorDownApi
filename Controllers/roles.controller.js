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

const getRolID = async (req,res) => {
    const { idRol } = req.params; 
    connection.query(`SELECT R.ID_ROLES, R.NOMBRE_ROL, P.CREAR_BENE, P.ACTUALIZA_BENE, P.INHABILITAR_BENE, P.CREAR_AREAS, P.BORRAR_AREAS, P.ACTUALIZAR_AREAS, P.CREAR_USUARIOS, P.INHABILITAR_USUARIOS, P.ACTUALIZAR_USUARIOS, P.CREAR_SESIONES, P.ACTUALIZAR_SESIONES, P.BORRAR_SESIONES, P.VER_REPORTES, P.VER_BENEFICIARIOS, P.VER_USUARIOS, P.VER_SESIONES, P.VER_AREAS FROM ROLES R 
    INNER JOIN PERMISOS P ON R.ID_ROLES = P.ID_ROL WHERE R.ID_ROLES = ${idRol}`, (error, results) => {
        if(error){
            console.log(error);
        }else{
            res.json(results);
        }
    })
}

const createRoles = async (req, res) =>{
    const {nombre_rol,cBene,aBene,iBene,cAreas,bAreas,aAreas,cUsuario,iUsuario,aUsuario,cSesiones,aSesiones,bSesiones,vReportes,vBene,vUsuario,vSesiones} = req.body; 

    connection.query(`INSERT INTO ROLES SET ?`, {nombre_rol:nombre_rol}, (error, results) => {
        if(error){
            console.log(error);
        }else{
            connection.query('SELECT id_roles FROM ROLES ORDER BY id_roles DESC LIMIT 1', (error, results) => {
                if(error){
                    console.log(error);
                }else{
                    id = results[0].id_roles;
                    connection.query(`INSERT INTO PERMISOS SET ?`, {ID_ROL:id, CREAR_BENE:cBene, ACTUALIZA_BENE:aBene, INHABILITAR_BENE:iBene, CREAR_AREAS:cAreas, BORRAR_AREAS:bAreas, ACTUALIZAR_AREAS:aAreas, CREAR_USUARIOS:cUsuario, INHABILITAR_USUARIOS:iUsuario, ACTUALIZAR_USUARIOS:aUsuario, CREAR_SESIONES:cSesiones, ACTUALIZAR_SESIONES:aSesiones, BORRAR_SESIONES:bSesiones, VER_REPORTES:vReportes, VER_BENEFICIARIOS:vBene, VER_USUARIOS:vUsuario, VER_SESIONES:vSesiones}, (error, results) => {
                        if(error){
                            console.log(error);
                        }else{
                            res.json({data: "Rol creado correctamente"});
                        }
                    })
                }
            })
        }
    })
}


const updateRoles = async (req, res) => {
    const {ID_ROLES, NOMBRE_ROL,CREAR_BENE,ACTUALIZA_BENE,INHABILITAR_BENE,CREAR_AREAS,BORRAR_AREAS,ACTUALIZAR_AREAS,CREAR_USUARIOS,INHABILITAR_USUARIOS,ACTUALIZAR_USUARIOS,CREAR_SESIONES,ACTUALIZAR_SESIONES,BORRAR_SESIONES,VER_REPORTES,VER_BENEFICIARIOS,VER_USUARIOS,VER_SESIONES, VER_AREAS} = req.body;
    
    connection.query(`UPDATE ROLES SET nombre_rol = '${NOMBRE_ROL}' WHERE id_roles = ${ID_ROLES}`, (error, results) => {
        if(error){
            console.log(error);
        }else{
            connection.query(`UPDATE PERMISOS SET CREAR_BENE = ${CREAR_BENE}, ACTUALIZA_BENE = ${ACTUALIZA_BENE}, INHABILITAR_BENE = ${INHABILITAR_BENE}, CREAR_AREAS = ${CREAR_AREAS}, BORRAR_AREAS = ${BORRAR_AREAS}, ACTUALIZAR_AREAS = ${ACTUALIZAR_AREAS}, CREAR_USUARIOS = ${CREAR_USUARIOS}, INHABILITAR_USUARIOS = ${INHABILITAR_USUARIOS}, ACTUALIZAR_USUARIOS = ${ACTUALIZAR_USUARIOS}, CREAR_SESIONES = ${CREAR_SESIONES}, ACTUALIZAR_SESIONES = ${ACTUALIZAR_SESIONES}, BORRAR_SESIONES = ${BORRAR_SESIONES}, VER_REPORTES = ${VER_REPORTES}, VER_BENEFICIARIOS = ${VER_BENEFICIARIOS}, VER_USUARIOS = ${VER_USUARIOS}, VER_SESIONES = ${VER_SESIONES}, VER_AREAS = ${VER_AREAS} WHERE ID_ROL = ${ID_ROLES}`, (error, results) => {
                if(error){
                    console.log(error);
                }else{
                    res.json({data: "Rol actualizado correctamente"});
                }
            })
        }
    })
}


const DeleteRoles = async (req,res) =>{
    const {idRol} = req.params;
    connection.query(`DELETE FROM ROLES WHERE id_roles = ${idRol}`, (error, results) => {
        if(error){
            console.log(error);
        }else{
            connection.query(`DELETE FROM PERMISOS WHERE ID_ROL = ${idRol}`, (error, results) => {
                if(error){
                    console.log(error);
                }else{
                    res.json({data: "Rol eliminado correctamente"});
                }
            })
        }
    })
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
    getRolID,
    createRoles,
    DeleteRoles,
    AddModulesToRoles,
    updateModulesToRoles,
    getAllRolesAndModules,
    modulesByRol,
    updateRoles
}
