const {sequelize, connection} = require("../Database/bd");
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); 
const {transporter} = require('../services/nodemailer.services');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    try {
        const usuarios  = await sequelize.query('SELECT email, nombre FROM USUARIOS', { type: QueryTypes.SELECT }); 
        res.json({data:usuarios});
    } catch (error) {
        console.error(error);
    }
}

const getUsersAndRoles = async (req, res) => {
    try {
        const consulta = await sequelize.query('SELECT  USUARIOS.nombre, ROLES.nombre_rol FROM USUARIOS INNER JOIN ROLES ON ROLES.id_roles', { type: QueryTypes.SELECT });
        res.json({data: consulta}); 
    } catch (error) {
        console.error(error); 
    }
}

const createUsers = async(req, res) => {
    const {email, nombre, id_roles} = req.body;
        const status = "1";

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

        const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    
   
        if(!email.trim().length || !password.trim().length  || !nombre.trim().length || !status.trim().length){
            res.json({
                message: 'Faltan datos',
                auth: false,
                token: null
            })
        }else if (!emailregex.test(email)){
            res.json({
                message: 'El correo electronico no es valido',
                auth: false,
                token: null
            })
        }else {
            connection.query('SELECT * FROM USUARIOS WHERE email = ?', [email], async (error, results) => {
            if(error){
                console.log(error);
            }else{
                if(results.length > 0){
                    res.json({
                        message: 'Este usuario ya esta registrado',
                        auth: false,
                        token: null
                    })
                }else if (!passregex.test(password)){
                    res.json({
                        message: 'La contraseña no es valida',
                        auth: false,
                        token: null
                    })
                }else {
                    connection.query('INSERT INTO USUARIOS SET ?', {email: email, nombre: nombre, id_roles: id_roles, contraseña: passwordHash,estado: status },async (error, results) =>{
            if(error){
                console.log(error);
            }else{ 
                try{
                    const mail = await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: email,
                        subject: 'Gracias por ser parte del grupo AMOR DOWN',
                        html: `<h1>Bienvenid@ ${nombre}</h1>
                        <p>Su contraseña para ingresar al sistema es:</p>
                        <p>${password}</p>
                        <p>Por favor no olvide cambiarla</p>`
                    }
                    );
                    console.log("Email enviado");
            }catch(error){
                console.log(error);
            } 
                res.json({
                    message: 'Se ha enviado un correo de confirmacion',
                    auth: true,
                    token:jwt.sign({email: email}, process.env.SECRET, {expiresIn: 60 * 60 * 24 * 30}),
               
                });
            }
        });
        }
        }
    });
    }
}

const updateUsers = async (req, res) => {
    const {id, email, nombre, id_roles, status} = req.body;
        const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(!idlogin.trim().length || !email.trim().length || !nombre.trim().length || !lastName.trim().length || !role.trim().length || !status.trim().length){
            res.json({
                message: 'Faltan datos',
                auth: false,
                token: null
            })
        }else if (!emailregex.test(email)){
            res.json({
                message: 'los datos no son validos',
                auth: false,
                token: null
            })
        }else {
            connection.query('UPDATE USUARIOS SET ? WHERE id = ?', [{email: email, nombre: nombre, id_roles: id_roles,status: status }, id], (error, results) =>{
                        if(error){
                            console.log(error);
                        }else{ 
                            res.json({
                                message: 'Usuario actualizado',
                                auth: true,
                                token:jwt.sign({email: email}, process.env.SECRET, {expiresIn: 60 * 60 * 24 * 30}),
                             
                            });
                        }
                    });
                }
}

const updateUsersPassword = async (req, res) => {
    const {id, password} = req.body;
    const passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    let passwordHash = await bcrypt.hash(password, 10);

    if(!id.trim().length || !password.trim().length){
        res.json({
            message: 'Faltan datos',
            auth: false,
            token: null
        })
    }else if (!passregex.test(password)){
        res.json({
            message: 'La contraseña no es valida',
            auth: false,
            token: null
        })
    }else {
        
        connection.query('UPDATE USUARIOS SET ? WHERE id = ?', [{contraseña: passwordHash}, id], (error, results) =>{
                    if(error){
                        console.log(error);
                    }else{ 
                        res.json({
                            message: 'Contraseña actualizada',
                            auth: true,
                            token:jwt.sign({email: email}, process.env.SECRET, {expiresIn: 60 * 60 * 24 * 30}),
                         
                        });
                    }
                });
            }
}

const updateUsersRol = async (req, res) => {
    const {id, id_roles} = req.body;

    if(!id.trim().length || !id_roles.trim().length){
        res.json({
            message: 'Faltan datos',
            auth: false,
            token: null
        })
    }else {
        connection.query('UPDATE USUARIOS SET ? WHERE id = ?', [{id_roles: id_roles}, id], (error, results) =>{
                    if(error){
                        console.log(error);
                    }else{ 
                        res.json({
                            message: 'Rol actualizado',
                            auth: true,
                            token:jwt.sign({email: email}, process.env.SECRET, {expiresIn: 60 * 60 * 24 * 30}),
                         
                        });
                    }
                }
            );
        }
}

const inactivateUsers = async (req, res) => {
    const {id} = req.body;

    if(!id.trim().length){
        res.json({
            message: 'Faltan datos',
            auth: false,
            token: null
        })
    }else {
        connection.query('UPDATE USUARIOS SET ? WHERE id = ?', [{status: 0}, id], (error, results) =>{
                    if(error){
                        console.log(error);
                    }else{ 
                        res.json({
                            message: 'Usuario inactivado',
                            auth: true,
                            token:jwt.sign({email: email}, process.env.SECRET, {expiresIn: 60 * 60 * 24 * 30}),
                         
                        });
                    }
                }
            );
        }
}



module.exports = {
    getUsers,
    createUsers,
    getUsersAndRoles,
    updateUsers,
    updateUsersPassword,
    updateUsersRol,
    inactivateUsers
}
