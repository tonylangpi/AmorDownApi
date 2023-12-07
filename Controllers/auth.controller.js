const { sequelize, connection } = require("../Database/bd");
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { transporter } = require('../services/nodemailer.services');



const login = async (req, res) => {
    const { email, password } = req.body;
    const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const fechaActual = new Date();
    const fechaYHoraActualString = fechaActual.toLocaleDateString() + ' ' + fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();

    if (!email.trim().length || !password.trim().length) {
        res.json({
            message: 'Faltan datos',
            auth: false,
            token: null
        })
    } else if (!emailregex.test(email)) {
        res.json({
            message: 'El correo electronico no es valido',
            auth: false,
            token: null
        })
    } else {
        connection.query(`SELECT U.id, U.nombre, R.id_roles, R.nombre_rol, AU.ID_AREA, A.NOMBRE AS NOMBRE_AREA, U.telefono, U.contraseña, EU.id_empresa, E.direccion, N.NIVEL, P.CREAR_BENE, P.ACTUALIZA_BENE, P.INHABILITAR_BENE, P.CREAR_AREAS, P.BORRAR_AREAS, P.ACTUALIZAR_AREAS, P.CREAR_USUARIOS, P.INHABILITAR_USUARIOS, P.ACTUALIZAR_USUARIOS, P.CREAR_SESIONES, P.ACTUALIZAR_SESIONES, P.BORRAR_SESIONES , P.VER_REPORTES , P.VER_BENEFICIARIOS , P.VER_USUARIOS, P.VER_SESIONES
        FROM USUARIOS U
               inner join ROLES R ON R.id_roles = U.ID_ROL
               inner join AREAS_USUARIOS AU ON AU.ID_USUARIOS = U.id
               inner join AREAS A ON A.ID_AREA = AU.ID_AREA
               inner join EMPRESA_USUARIO EU ON EU.id_usuario = U.id
               inner join EMPRESA E ON E.id_empresa = EU.id_empresa
               inner join NIVELES N on N.ID_NIVEL = U.ID_NIVEL
               inner join PERMISOS P on R.id_roles = P.ID_ROL
         WHERE email =?`, [email], async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                if (results.length > 0) {
                    const comparar = await bcryptjs.compare(password, results[0].contraseña);
                    if (comparar) {

                        connection.query('INSERT INTO BITACORA SET ?', { fecha_hora_inicio: fechaYHoraActualString, fecha_hora_cierre: fechaYHoraActualString, id_usuario: results[0].id });


                        res.json({
                            message: "bienvenido de nuevo",
                            auth: true,
                            token: jwt.sign({
                                email: email,
                                fecha: fechaYHoraActualString,
                                id: results[0].id,
                                nombre: results[0].nombre,
                                id_roles: results[0].id_roles,
                                nombre_rol: results[0].nombre_rol,
                                id_area: results[0].ID_AREA,
                                nombre_area: results[0].NOMBRE_AREA,
                                telefono: results[0].telefono,
                                id_empresa: results[0].id_empresa,
                                direccion: results[0].direccion, 
                                nivel: results[0].NIVEL,
                                crear_bene: results[0].CREAR_BENE,
                                actualizar_bene: results[0].ACTUALIZA_BENE,
                                inhabilitar_bene: results[0].INHABILITAR_BENE,
                                crear_areas: results[0].CREAR_AREAS,
                                borrar_areas: results[0].BORRAR_AREAS,
                                actualizar_areas: results[0].ACTUALIZAR_AREAS,
                                crear_usuarios: results[0].CREAR_USUARIOS,
                                inhabilitar_usuarios: results[0].INHABILITAR_USUARIOS,
                                actualizar_usuarios: results[0].ACTUALIZAR_USUARIOS,
                                crear_sesiones: results[0].CREAR_SESIONES,
                                actualizar_sesiones: results[0].ACTUALIZAR_SESIONES,
                                borrar_sesiones: results[0].BORRAR_SESIONES,
                                ver_reportes: results[0].VER_REPORTES,
                                ver_beneficiarios: results[0].VER_BENEFICIARIOS,
                                ver_usuarios: results[0].VER_USUARIOS,
                                ver_sesiones: results[0].VER_SESIONES
                                }, process.env.SECRET, { expiresIn: 60 * 60 * 24 * 30 }),
                                nombre: results[0].nombre,
                                nivel: results[0].NIVEL,
                                nombre_rol: results[0].nombre_rol,
                                id: results[0].id,
                        })
                    } else {
                        res.json({
                            message: "usuario o contraseña incorrectos",
                            auth: false,
                            token: null
                        })
                    }
                } else {
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
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET);
    const fechaActual = new Date();
    const fechaYHoraActualString = fechaActual.toLocaleDateString() + ' ' + fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();


    connection.query('UPDATE BITACORA SET ? WHERE fecha_hora_inicio = ?', [{ fecha_hora_cierre: fechaYHoraActualString }, decoded.fecha]);

    res.json({
        message: "Sesion cerrada",
        auth: false,
        token: null

    })
}

const mailRecoverPassword = async (req, res) => {
    const { email } = req.body;
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

    if (!email.trim().length) {
        res.json({
            message: 'Faltan datos',
            auth: false,
            token: null
        })
    } else if (!emailregex.test(email)) {
        res.json({
            message: 'El correo electronico no es valido',
            auth: false,
            token: null
        })
    } else {
        connection.query('SELECT * FROM USUARIOS WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
            } else {

                if (results.length > 0) {

                    try {
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
                    } catch (error) {
                        console.log(error);
                    }

                    res.json({
                        message: "Correo enviado",
                        auth: true,
                        token: jwt.sign({ contraseña: password }, process.env.SECRET, { expiresIn: 60 * 5 }),

                    })
                } else {
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

const auth = (req, res, next) => {
    const { token} = req.body;

    if (token) {

        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            if (decoded) {
            res.json({
                message: "Token valido",
                auth: true,
                datos: decoded
            });
        } else {
            res.json({

                message: "No autorizado",
                auth: false
            });
        }

            //quiero retornar verdadero para que el middleware de la ruta pueda continuar
            next();
        } catch (error) {
            res.json({
                message: "Token invalido",
                auth: false
            });

        }
    }
    else {
        res.json({
            message: "No autorizado",
            auth: false
        });

    }

}




module.exports = {
    login,
    logout,
    mailRecoverPassword,
    auth
}

