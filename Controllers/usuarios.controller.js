const { sequelize, connection } = require("../Database/bd");
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { transporter } = require('../services/nodemailer.services');
const jwt = require('jsonwebtoken');

const getUsers = (req, res) => {
    connection.query('Select US.id AS ID_USUARIO, US.email AS EMAIL_USUARIO, US.nombre AS NOMBRE_USUARIO, US.estado AS ESTADO_USUARIO, RO.nombre_rol AS ROL_USUARIO, A.NOMBRE AS NOMBRE_AREA, E.nombre AS NOMBRE_EMPRESA , E.direccion AS DIRECCION_EMPRESA from USUARIOS US inner join ROLES RO on US.id_roles = RO.id_roles inner join AREAS_USUARIOS AU ON AU.ID_USUARIOS = US.id INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA INNER JOIN EMPRESA_USUARIO EU ON EU.id_usuario = US.id INNER JOIN EMPRESA E ON E.id_empresa = EU.id_empresa ORDER BY US.id ASC', (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    })

}

const getUser = (req, res) => {
    const { id } = req.params;
    const { } = req.body;
    connection.query('Select US.id, US.email, US.nombre, US.estado, RO.nombre_rol from USUARIOS US inner join ROLES RO on US.id_roles = RO.id_roles where id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    })
}

const getUserName = (req, res) => {
    const { } = req.params;
    const { nombre } = req.body;
    connection.query(`Select US.id AS ID_USUARIO, US.email AS EMAIL_USUARIO, US.nombre AS NOMBRE_USUARIO, US.estado AS ESTADO_USUARIO, RO.nombre_rol AS ROL_USUARIO, A.NOMBRE AS NOMBRE_AREA, E.nombre AS NOMBRE_EMPRESA , E.direccion AS DIRECCION_EMPRESA from USUARIOS US inner join ROLES RO on US.id_roles = RO.id_roles inner join AREAS_USUARIOS AU ON AU.ID_USUARIOS = US.id INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA INNER JOIN EMPRESA_USUARIO EU ON EU.id_usuario = US.id INNER JOIN EMPRESA E ON E.id_empresa = EU.id_empresa  where US.nombre Like '%${nombre}%' ORDER BY US.id ASC`, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(results);
        }
    })
}

const createUsers = async (req, res) => {
    
    const { email, nombre, id_nivel, id_rol, id_empresa, id_area, telefono } = req.body;
    const estado = "1";
    const estado_contraseña = 0;

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


    if (!email.trim().length || !password.trim().length || !nombre.trim().length || !estado.trim().length) {
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
                    res.json({
                        message: 'Este usuario ya esta registrado',
                        auth: false,
                        token: null
                    })
                } else if (!passregex.test(password)) {
                    res.json({
                        message: 'La contraseña no es valida',
                        auth: false,
                        token: null
                    })
                } else {
                    connection.query('INSERT INTO USUARIOS SET ?', { email: email, nombre: nombre, contraseña: passwordHash, estado: estado, telefono: telefono, ID_NIVEL: id_nivel, ESTADO_CONTRASEÑA: estado_contraseña, ID_ROL: id_rol }, async (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            connection.query('SELECT * FROM USUARIOS WHERE email = ?', [email], async (error, results) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    const id = results[0].id;

                                    connection.query('INSERT INTO EMPRESA_USUARIO SET ?', { id_usuario: id, id_empresa: id_empresa }, async (error, results) => {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            connection.query('INSERT INTO AREAS_USUARIOS SET ?', { ID_USUARIOS: id, ID_AREA: id_area }, async (error, results) => {
                                                if (error) {
                                                    console.log(error);
                                                } else {


                                                    try {
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
                                                    } catch (error) {
                                                        console.log(error);
                                                    }
                                                    res.json({
                                                        message: 'Se ha enviado un correo de confirmacion',
                                                        auth: true,
                                                        token: jwt.sign({ email: email }, process.env.SECRET, { expiresIn: 60 * 60 * 24 * 30 }),
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    }
}

const updateUsers = async (req, res) => {
    const { id } = req.params
    const { email, nombre, estado, telefono, id_nivel, id_rol, id_empresa, id_area } = req.body;
    const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!email.trim().length || !nombre.trim().length || !estado.trim().length) {
        res.json({
            message: 'Faltan datos',
            auth: false,
            token: null
        })
    } else if (!emailregex.test(email)) {
        res.json({
            message: 'los datos no son validos',
            auth: false,
            token: null
        })
    } else {
        connection.query('UPDATE USUARIOS SET ? WHERE id = ?', [{ email: email, nombre: nombre, estado: estado, telefono: telefono, ID_NIVEL: id_nivel, ID_ROL: id_rol }, id], (error, results) => {
            if (error) {
                console.log(error);
            } else {

                connection.query('UPDATE EMPRESA_USUARIO SET ? WHERE id_usuario = ?', [{ id_empresa: id_empresa }, id], (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        connection.query('UPDATE AREAS_USUARIOS SET ? WHERE ID_USUARIOS = ?', [{ ID_AREA: id_area }, id], (error, results) => {
                            if (error) {
                                console.log(error);
                            } else {


                                res.json({
                                    message: 'Usuario actualizado',

                                })
                            }
                        })
                    }
                })
            }
        })
    }
}

const updateUsersPassword = async (req, res) => {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET);
    const estado_contraseña = 1;
    const passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    let passwordHash = await bcrypt.hash(password, 10);

    if (!id.trim().length || !password.trim().length) {
        res.json({
            message: 'Faltan datos',
            auth: false,
            token: null
        })
    } else if (!passregex.test(password)) {
        res.json({
            message: 'La contraseña no es valida',
            auth: false,
            token: null
        })
    } else {

        connection.query('UPDATE USUARIOS SET ? WHERE id = ?', [{ contraseña: passwordHash, ESTADO_CONTRASEÑA:estado_contraseña }, decoded.id], (error, results) => {
            if (error) {
                console.log(error);
            } else {
                res.json({
                    message: 'Contraseña actualizada',
                    auth: true,
                    token: jwt.sign({ email: email }, process.env.SECRET, { expiresIn: 60 * 60 * 24 * 30 }),

                });
            }
        });
    }
}

const inactivateUsers = async (req, res) => {
    const { id } = req.body;

    connection.query('UPDATE USUARIOS SET ? WHERE id = ?', [{ estado: 0 }, id], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json({
                message: 'Usuario inactivado',

            });
        }
    }
    );
}

const getLevels = async (req, res) => {
    connection.query('SELECT * FROM NIVELES', (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(
                results
            );
        }
    })
}

const getCompany = async (req, res) => {
    connection.query('SELECT * FROM EMPRESA', (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.json(
                results
            );
        }
    })
}

module.exports = {
    getUsers,
    getUser,
    getUserName,
    createUsers,
    updateUsers,
    updateUsersPassword,
    inactivateUsers,
    getLevels,
    getCompany
}
