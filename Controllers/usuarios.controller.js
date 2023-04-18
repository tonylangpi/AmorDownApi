const {sequelize} = require("../Database/bd");
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); 
const {User} = require('../Models/login');
const { PassThrough } = require("stream");

const getUsers = async (req, res) => {
    try {
        const usuarios  = await User.findAll(); 
        res.json({data:usuarios});
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
        await User.create({
            email: email,
            nombre: nombre,
            nit: nit,
            DPI: DPI,
            direccion: direccion,
            telefono: telefono,
            id_roles: id_roles,
            CONTRASEÑA: passwordHash
        })
        res.json("usuario creado correctamente");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUsers,
    createUsers
}
