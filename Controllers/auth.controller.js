const {sequelize, connection} = require("../Database/bd");
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const {transporter} = require('../services/nodemailer.services');



const login = async(req, res) =>{
    const {email, password} = req.body;
    const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const fechaActual = new Date();
    const fechaYHoraActualString = fechaActual.toLocaleDateString() + ' ' + fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();
 
    if(!email.trim().length || !password.trim().length){
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
        connection.query('SELECT * FROM USUARIOS WHERE email = ?', [email], async (error, results) =>{
        if(error){
            console.log(error);
        }else{
            if(results.length > 0){
                const comparar = await bcryptjs.compare(password, results[0].contraseña);
                if(comparar){
                    

                    connection.query('INSERT INTO BITACORA SET ?', {fecha_hora_inicio: fechaYHoraActualString, fecha_hora_cierre: fechaYHoraActualString, id_usuario: results[0].id});


                    res.json({
                        message: "bienvenido de nuevo",
                        auth: true,
                        token: jwt.sign({email: email}, process.env.SECRET, {expiresIn: 60 * 60 * 24 * 30}),
                        fecha:fechaYHoraActualString
                })
                }else{
                    res.json({
                        message: "usuario o contraseña incorrectos",
                        auth: false,
                        token: null
                    })
                }
            }else{
                res.json({
                    message: "usuario no registrado",
                    auth: false,
                    token: null
                })
            }
        }
    })
}
}

const logout = (req, res) => {
    let {fecha} = req.body;
    const fechaActual = new Date();
    const fechaYHoraActualString = fechaActual.toLocaleDateString() + ' ' + fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();
 

    connection.query('UPDATE BITACORA SET ? WHERE fecha_hora_inicio = ?', [{fecha_hora_cierre: fechaYHoraActualString}, fecha] );

    res.json({
        message: "Sesion cerrada",
        auth: false,
        token: null
     
    })
}

const mailRecoverPassword = async (req, res) => {
    const {email} = req.body;
    const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

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

    if(!email.trim().length){
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
        connection.query('SELECT * FROM USUARIOS WHERE email = ?', [email], async (error, results) =>{
            if(error){
                console.log(error);
            }else{

                if(results.length > 0){

                    try{
                        const mail = await transporter.sendMail({
                            from: process.env.EMAIL,
                            to: email,
                            subject: 'Gracias por ser parte del grupo AMOR DOWN',
                            html: `<h1>Bienvenid@</h1>
                            <p>La clave de recuperacion de cuenta es:</p>
                            <p>${password}</p>
                            <p>esta clave vencera dentro de 5 minutos</p>`
                        }
                        );
                        console.log("Email enviado");
                }catch(error){
                    console.log(error);
                } 

                    res.json({
                        message: "Correo enviado",
                        auth: true,
                        token: jwt.sign({contraseña: password}, process.env.SECRET, {expiresIn: 60 * 5}),
               
                })
                }else{
                    res.json({
                        message: "usuario no registrado",
                        auth: false,
                        token: null
                    })
                }
            }
        })
    }
}



module.exports = {
    login,
    logout,
    mailRecoverPassword
}

