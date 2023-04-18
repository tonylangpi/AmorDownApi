const {sequelize} = require("../Database/bd");
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); 

const getUsers = async (req, res) => {
    try {
        const usuarios  = await sequelize.query('SELECT * FROM usuarios', { type: QueryTypes.SELECT }); 
        res.json({data:usuarios});
    } catch (error) {
        console.error(error);
    }
}

const getUsersAndRoles = async (req, res) => {
    try {
        const consulta = await sequelize.query('SELECT  usuarios.nombre, ROLES.nombre_rol FROM usuarios INNER JOIN ROLES ON ROLES.id_roles', { type: QueryTypes.SELECT });
        res.json({data: consulta}); 
    } catch (error) {
        console.error(error); 
    }
}
const createUsers = async(req, res) => {
    const {email, nombre, nit, DPI, direccion, telefono, id_roles} = req.body;
         const status = "active";

        const numeros = "0123456789";
        const letrasMayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const letrasMinusculas = "abcdefghijklmnopqrstuvwxyz";
        const simbolos = "!@#$%^&*()_+";
        
        let caracteres = "";
        let contraseña = "";
        let longitud = 14;
        
        // Agregar al menos un caracter de cada tipo
        caracteres += numeros.charAt(Math.floor(Math.random() * numeros.length));
        caracteres += letrasMayusculas.charAt(Math.floor(Math.random() * letrasMayusculas.length));
        caracteres += letrasMinusculas.charAt(Math.floor(Math.random() * letrasMinusculas.length));
        caracteres += simbolos.charAt(Math.floor(Math.random() * simbolos.length));
        
        // Completar la contraseña con caracteres aleatorios
        for (let i = 0; i < longitud - 4; i++) {
          caracteres += numeros + letrasMayusculas + letrasMinusculas + simbolos;
          contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }

        const password = contraseña;
        let passwordHash = await bcrypt.hash(password, 10);
    
    try {
        await sequelize.query(`INSERT INTO usuarios(email, nombre, nit, DPI, direccion, telefono, id_roles, CONTRASEÑA) VALUES ('${email}', '${nombre}',  '${nit}', '${DPI}', '${direccion}', '${telefono}', ${id_roles}, '${passwordHash}')`, { type: QueryTypes.INSERT });
        res.json("usuario creado correctamente");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUsers,
    createUsers,
    getUsersAndRoles,
}
