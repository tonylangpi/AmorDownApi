const { sequelize, connection } = require("../Database/bd");
const fs = require("fs");
const xl = require("excel4node");
const path = require("path");
const jwt = require("jsonwebtoken");

const sesionsForAreas = async (req, res) => {
  const { fecha_desde, fecha_hasta } = req.params;
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.SECRET);
  const {} = req.body;
  try {
    if (fecha_desde == null && fecha_hasta == null) {
      connection.query(
        `SELECT A.NOMBRE AS AREA, CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BENEFICIARIO, SB.FECHA, CONCAT(\'SESION NO.\',S.NUMERO_SESION) AS SESIONES, S.HORA_INGRESO, S.HORA_EGRESO FROM SESIONES_BENEFICIARIO SB
        INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
         INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
        INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
        INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
        INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
        WHERE SB.ID_USUARIO = ${decoded.id}  AND E.ID_EMPRESA = ${decoded.id_empresa} AND SB.FECHA >= '1000-01-01' AND SB.FECHA <= '9999-12-31'`,
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.json(results);
          }
        }
      );
    } else {
      connection.query(
        `SELECT A.NOMBRE AS AREA, CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BENEFICIARIO, SB.FECHA, CONCAT(\'SESION NO.\',S.NUMERO_SESION) AS SESIONES, S.HORA_INGRESO, S.HORA_EGRESO FROM SESIONES_BENEFICIARIO SB
        INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
         INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
        INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
        INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
        INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
        WHERE SB.ID_USUARIO = ${decoded.id}  AND E.ID_EMPRESA = ${decoded.id_empresa} AND SB.FECHA >= '${fecha_desde}'AND SB.FECHA <= '${fecha_hasta}'`,
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.json(results);
          }
        }
      );
    }
  } catch (error) {
    res.json(error);
  }
};

const sesionsForBeneficiary = async (req, res) => {
  const { idBeneficiario, fecha_desde, fecha_hasta } = req.params;
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.SECRET);

  // const {} = req.body;
  try {
    if (fecha_desde == null || fecha_hasta == null) {
      connection.query(
        `SELECT CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BENEFICIARIO, B.SEXO, DATEDIFF(CURDATE(),FECHA_NACIMIENTO) / 365 AS EDAD, A.NOMBRE AS AREA_ATENDIO, SB.FECHA, CONCAT(\'SESION NO. \',S.NUMERO_SESION) AS SESION_ATENDIDA, CONCAT( S.HORA_INGRESO, \' a \', S.HORA_EGRESO) AS HORARIO_ATENDIDO FROM SESIONES_BENEFICIARIO SB
            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
            INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
            INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
            INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA WHERE SB.ID_BENEFICIARIO = ${idBeneficiario} AND E.ID_EMPRESA = ${decoded.id_empresa} AND SB.FECHA >= '1000-01-01' AND SB.FECHA <= '9999-12-31'`,
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.json(results);
          }
        }
      );
    } else {
      connection.query(
        `SELECT CONCAT(B.NOMBRE1, \' \', B.NOMBRE2,\' \', B.APELLIDO1,\' \', B.APELLIDO2) AS BENEFICIARIO, B.SEXO, DATEDIFF(CURDATE(),FECHA_NACIMIENTO) / 365 AS EDAD, A.NOMBRE AS AREA_ATENDIO, SB.FECHA, CONCAT(\'SESION NO. \',S.NUMERO_SESION) AS SESION_ATENDIDA, CONCAT( S.HORA_INGRESO, \' a \', S.HORA_EGRESO) AS HORARIO_ATENDIDO FROM SESIONES_BENEFICIARIO SB
            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
            INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
            INNER JOIN SESIONES S ON SB.ID_SESION = S.ID_SESION 
            INNER JOIN AREAS_USUARIOS AU ON SB.ID_USUARIO = AU.ID_USUARIOS
            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA WHERE SB.ID_BENEFICIARIO = ${idBeneficiario} AND E.ID_EMPRESA = ${decoded.id_empresa} AND SB.FECHA >= ' ${fecha_desde}' AND SB.FECHA <= ' ${fecha_hasta} '`,
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.json(results);
          }
        }
      );
    }
  } catch (error) {
    res.json(error);
  }
};

const reporteCuantitativo = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    if (formatoFecha.test(desde) && formatoFecha.test(hasta)) {
      connection.query(
        `
        SELECT 
        CONCAT(B.NOMBRE1, ' ', B.NOMBRE2) AS NOMBRES,
        CONCAT(B.APELLIDO1, ' ', B.APELLIDO2) AS APELLIDOS, 
        B.SEXO, 
        TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD,
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) > 18 THEN 'ADULTO'
          ELSE 'NIÑO'  
        END AS CLASIFICACION,
        HC.DIAGNOSTICO,
        HC.DISCAPACIDAD,
        COUNT(SB.ID_SESION_BENEFICIARIO) AS ASISTENCIA
      FROM SESIONES_BENEFICIARIO SB
      INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
      INNER JOIN HISTORIAL_CLINICO HC ON B.ID_BENEFICIARIO = HC.ID_BENEFICIARIO 
      WHERE SB.FECHA BETWEEN ? AND ?
      GROUP BY NOMBRES, APELLIDOS, B.SEXO, EDAD, CLASIFICACION, DIAGNOSTICO, DISCAPACIDAD;
       `,
        [desde, hasta],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.json(results);
          }
        }
      );
    } else {
      res.json({ mensaje: "formato de fecha incorrecto" });
    }
  } catch (error) {
    res.send(error);
  }
};
/*metodo que genera el archivo excel del reporte cuantitativo*/
const excelReporteCuantitativo = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    if (formatoFecha.test(desde) && formatoFecha.test(hasta)) {
      connection.query(
        `
        SELECT 
        CONCAT(B.NOMBRE1, ' ', B.NOMBRE2) AS NOMBRES,
        CONCAT(B.APELLIDO1, ' ', B.APELLIDO2) AS APELLIDOS, 
        B.SEXO, 
        TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD,
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) > 18 THEN 'ADULTO'
          ELSE 'NIÑO'  
        END AS CLASIFICACION,
        HC.DIAGNOSTICO,
        HC.DISCAPACIDAD,
        COUNT(SB.ID_SESION_BENEFICIARIO) AS ASISTENCIA
      FROM SESIONES_BENEFICIARIO SB
      INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
      INNER JOIN HISTORIAL_CLINICO HC ON B.ID_BENEFICIARIO = HC.ID_BENEFICIARIO 
      WHERE SB.FECHA BETWEEN ? AND ?
      GROUP BY NOMBRES, APELLIDOS, B.SEXO, EDAD, CLASIFICACION, DIAGNOSTICO, DISCAPACIDAD;
       `,
        [desde, hasta],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            var options = {
              margins: {
                left: 1.5,
                right: 1.5,
              },
            };
            // Configurar excel4node
            // Create a new instance of a Workbook class
            var wb = new xl.Workbook();
            let nombreArchivo = "ReporteCuantitativo";
            var ws = wb.addWorksheet(nombreArchivo,options);

            // Crear estilos
            var cualColumnaEstilo = wb.createStyle({
              font: {
                name: "Times New Roman",
                color: "#1C2833",
                size: 12,
                bold: true,
              },
            });

            var contenidoEstilo = wb.createStyle({
              font: {
                name: "Times New Roman",
                color: "#494949",
                size: 11,
              },
            });
            var contenidoEncabezaodo = wb.createStyle({
                font:{
                    name:"Times New Roman",
                    color:"#EC7063",
                    size: 16
                }
            })
            //Nombres de las columnas
            ws.cell(2,3,2,7,true).string("REPORTE CUANTITATIVO AMOR DOWN").style(contenidoEncabezaodo);
            ws.cell(2,8,2,9,true).string(`DESDE: ${desde}`);
            ws.cell(2,10,2,11,true).string(`HASTA: ${hasta}`);
            ws.cell(4, 1).string("NOMBRES").style(cualColumnaEstilo);
            ws.cell(4, 2).string("APELLIDOS").style(cualColumnaEstilo);
            ws.cell(4, 3).string("SEXO").style(cualColumnaEstilo);
            ws.cell(4, 4).string("EDAD").style(cualColumnaEstilo);
            ws.cell(4, 5).string("CLASIFICACION").style(cualColumnaEstilo);
            ws.cell(4, 6).string("DIAGNOSTICO").style(cualColumnaEstilo);
            ws.cell(4, 7).string("DISCAPACIDAD").style(cualColumnaEstilo);
            ws.cell(4, 8).string("ASISTENCIA").style(cualColumnaEstilo);

            let cualFila = 5;
            // Foreach - creación de datos
            results.forEach((datos) => {
              // NOMBRES
              ws.cell(cualFila, 1).string(datos.NOMBRES).style(contenidoEstilo);
              // apellidoS
              ws.cell(cualFila, 2).string(datos.APELLIDOS).style(contenidoEstilo);
              // SEXO
              ws.cell(cualFila, 3).string(datos.SEXO).style(contenidoEstilo);
              // EDAD
              ws.cell(cualFila, 4).number(datos.EDAD).style(contenidoEstilo);
              // CLASIFICACION
              ws.cell(cualFila, 5).string(datos.CLASIFICACION).style(contenidoEstilo);
              // DIAGNOSTICO
              ws.cell(cualFila, 6).string(datos.DIAGNOSTICO).style(contenidoEstilo);
             //DISCAPACIDAD
             ws.cell(cualFila, 7).string(datos.DISCAPACIDAD).style(contenidoEstilo);
             //ASISTENCIA
             ws.cell(cualFila, 8).number(datos.ASISTENCIA).style(contenidoEstilo);
              // Aumenta de fila
              cualFila = cualFila + 1;
            });

            //Ruta del archivo
            const pathExcel = path.join(
              __dirname,
              "reportes",
              nombreArchivo + ".xlsx"
            );
            //Escribir o guardar
            wb.write(pathExcel, function (err, stats) {
              if (err) console.log(err);
              else {
                // Crear función y descargar archivo
                function downloadFile() {
                  res.download(pathExcel);
                }
                downloadFile();

                // Borrar archivo
                fs.rm(pathExcel, function (err) {
                  if (err) console.log(err);
                  else
                    console.log(
                      "Archivo descargado y borrado del servidor correctamente"
                    );
                });
              }
            });
          }
        }
      );
    } else {
      res.json({ mensaje: "formato de fecha incorrecto" });
    }
  } catch (error) {
    res.send(error);
  }
};
const reporteF9 = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    if (formatoFecha.test(desde) && formatoFecha.test(hasta)) {
      connection.query(
        "DROP TEMPORARY TABLE IF EXISTS INFORME;",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            connection.query(
              `CREATE TEMPORARY TABLE INFORME AS (
                            SELECT SB.FECHA, 
                              B.REFERENCIA, 
                              CONCAT(B.NOMBRE1, ' ', B.NOMBRE2) AS NOMBRES,
                              CONCAT(B.APELLIDO1, ' ', B.APELLIDO2) AS APELLIDOS, 
                              B.DIRECCION, 
                              B.SEXO,
                              TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD, 
                              HC.DISCAPACIDAD, 
                              B.ESCOLARIDAD, 
                              SB.TIPO_SESION, 
                              HC.DIAGNOSTICO, 
                              A.NOMBRE AS SERVICIO_RECIBIDO
                            FROM SESIONES_BENEFICIARIO SB
                            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
                            INNER JOIN HISTORIAL_CLINICO HC ON B.ID_BENEFICIARIO = HC.ID_BENEFICIARIO 
                            INNER JOIN USUARIOS U ON SB.ID_USUARIO = U.ID
                            INNER JOIN AREAS_USUARIOS AU ON U.ID = ID_USUARIO
                            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
                            WHERE SB.FECHA BETWEEN ? AND ?
                            GROUP BY FECHA, REFERENCIA, NOMBRES, APELLIDOS, DIRECCION, SEXO, EDAD, DISCAPACIDAD, ESCOLARIDAD, TIPO_SESION, DIAGNOSTICO, SERVICIO_RECIBIDO
                          );`,
              [desde, hasta],
              (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  connection.query(
                    `SELECT 
                                GROUP_CONCAT(DISTINCT DAY(FECHA) SEPARATOR ', ') AS FECHA_DIAS,
                                REFERENCIA, 
                                NOMBRES, 
                                APELLIDOS, 
                                DIRECCION, 
                                SEXO, 
                                EDAD, 
                                DISCAPACIDAD, 
                                ESCOLARIDAD, 
                                GROUP_CONCAT(DISTINCT TIPO_SESION SEPARATOR ', ') AS TIPO_SESION,
                                DIAGNOSTICO, 
                                GROUP_CONCAT(DISTINCT SERVICIO_RECIBIDO SEPARATOR ', ') AS SERVICIO_RECIBIDO  
                              FROM INFORME
                              GROUP BY REFERENCIA, NOMBRES, APELLIDOS, DIRECCION, SEXO, EDAD, DISCAPACIDAD, ESCOLARIDAD, DIAGNOSTICO;`,
                    (error, results) => {
                      if (error) {
                        console.log(error);
                      } else {
                        res.json(results);
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } else {
      console.log("fecha" + desde, hasta);
    }
  } catch (error) {}
};

const excelReporteF9 = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    if (formatoFecha.test(desde) && formatoFecha.test(hasta)) {
      connection.query(
        "DROP TEMPORARY TABLE IF EXISTS INFORME;",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            connection.query(
              `CREATE TEMPORARY TABLE INFORME AS (
                            SELECT SB.FECHA, 
                              B.REFERENCIA, 
                              CONCAT(B.NOMBRE1, ' ', B.NOMBRE2) AS NOMBRES,
                              CONCAT(B.APELLIDO1, ' ', B.APELLIDO2) AS APELLIDOS, 
                              B.DIRECCION, 
                              B.SEXO,
                              TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD, 
                              HC.DISCAPACIDAD, 
                              B.ESCOLARIDAD, 
                              SB.TIPO_SESION, 
                              HC.DIAGNOSTICO, 
                              A.NOMBRE AS SERVICIO_RECIBIDO
                            FROM SESIONES_BENEFICIARIO SB
                            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
                            INNER JOIN HISTORIAL_CLINICO HC ON B.ID_BENEFICIARIO = HC.ID_BENEFICIARIO 
                            INNER JOIN USUARIOS U ON SB.ID_USUARIO = U.ID
                            INNER JOIN AREAS_USUARIOS AU ON U.ID = ID_USUARIO
                            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
                            WHERE SB.FECHA BETWEEN ? AND ?
                            GROUP BY FECHA, REFERENCIA, NOMBRES, APELLIDOS, DIRECCION, SEXO, EDAD, DISCAPACIDAD, ESCOLARIDAD, TIPO_SESION, DIAGNOSTICO, SERVICIO_RECIBIDO
                          );`,
              [desde, hasta],
              (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  connection.query(
                    `SELECT 
                                GROUP_CONCAT(DISTINCT DAY(FECHA) SEPARATOR ', ') AS FECHA_DIAS,
                                REFERENCIA, 
                                NOMBRES, 
                                APELLIDOS, 
                                DIRECCION, 
                                SEXO, 
                                EDAD, 
                                DISCAPACIDAD, 
                                ESCOLARIDAD, 
                                GROUP_CONCAT(DISTINCT TIPO_SESION SEPARATOR ', ') AS TIPO_SESION,
                                DIAGNOSTICO, 
                                GROUP_CONCAT(DISTINCT SERVICIO_RECIBIDO SEPARATOR ', ') AS SERVICIO_RECIBIDO  
                              FROM INFORME
                              GROUP BY REFERENCIA, NOMBRES, APELLIDOS, DIRECCION, SEXO, EDAD, DISCAPACIDAD, ESCOLARIDAD, DIAGNOSTICO;`,
                    (error, results) => {
                      if (error) {
                        console.log(error);
                      } else {
                        var options = {
                          margins: {
                            left: 1.5,
                            right: 1.5,
                          },
                        };
                        // Configurar excel4node
                        // Create a new instance of a Workbook class
                        var wb = new xl.Workbook();
                        let nombreArchivo = "ReporteF9";
                        var ws = wb.addWorksheet(nombreArchivo,options);
            
                        // Crear estilos
                        var cualColumnaEstilo = wb.createStyle({
                          font: {
                            name: "Times New Roman",
                            color: "#1C2833",
                            size: 12,
                            bold: true,
                          },
                        });
            
                        var contenidoEstilo = wb.createStyle({
                          font: {
                            name: "Times New Roman",
                            color: "#494949",
                            size: 11,
                          },
                        });
                        var contenidoEncabezaodo = wb.createStyle({
                            font:{
                                name:"Times New Roman",
                                color:"#EC7063",
                                size: 16
                            }
                        })
                        //Nombres de las columnas
                        ws.cell(2,3,2,7,true).string("REPORTE F9 AMOR DOWN").style(contenidoEncabezaodo);
                        ws.cell(2,8,2,9,true).string(`DESDE: ${desde}`).style(contenidoEncabezaodo);
                        ws.cell(2,10,2,11,true).string(`HASTA: ${hasta}`).style(contenidoEncabezaodo);
                        ws.cell(4, 1).string("FECHA_DIAS").style(cualColumnaEstilo);
                        ws.cell(4, 2).string("REFERENCIA").style(cualColumnaEstilo);
                        ws.cell(4, 3).string("NOMBRES").style(cualColumnaEstilo);
                        ws.cell(4, 4).string("APELLIDOS").style(cualColumnaEstilo);
                        ws.cell(4, 5).string("DIRECCION").style(cualColumnaEstilo);
                        ws.cell(4, 6).string("SEXO").style(cualColumnaEstilo);
                        ws.cell(4, 7).string("EDAD").style(cualColumnaEstilo);
                        ws.cell(4, 8).string("DISCAPACIDAD").style(cualColumnaEstilo);
                        ws.cell(4, 9).string("ESCOLARIDAD").style(cualColumnaEstilo);
                        ws.cell(4, 10).string("TIPO_SESION").style(cualColumnaEstilo);
                        ws.cell(4, 11).string("DIAGNOSTICO").style(cualColumnaEstilo);
                        ws.cell(4, 12,4,15,true).string("SERVICIO_RECIBIDO").style(cualColumnaEstilo);
                        let cualFila = 5;
                        // Foreach - creación de datos
                        results.forEach((datos) => {
                          ws.cell(cualFila, 1).string(datos.FECHA_DIAS).style(contenidoEstilo);
                          ws.cell(cualFila, 2).string(datos.REFERENCIA).style(contenidoEstilo);
                          ws.cell(cualFila, 3).string(datos.NOMBRES).style(contenidoEstilo);
                          ws.cell(cualFila, 4).string(datos.APELLIDOS).style(contenidoEstilo);
                          ws.cell(cualFila, 5).string(datos.DIRECCION).style(contenidoEstilo);
                          ws.cell(cualFila, 6).string(datos.SEXO).style(contenidoEstilo);
                          ws.cell(cualFila, 7).number(datos.EDAD).style(contenidoEstilo);
                          ws.cell(cualFila, 8).string(datos.DISCAPACIDAD).style(contenidoEstilo);
                          ws.cell(cualFila, 9).string(datos.ESCOLARIDAD).style(contenidoEstilo);
                          ws.cell(cualFila, 10).string(datos.TIPO_SESION).style(contenidoEstilo);
                          ws.cell(cualFila, 11).string(datos.DIAGNOSTICO).style(contenidoEstilo);
                          ws.cell(cualFila, 12).string(datos.SERVICIO_RECIBIDO).style(contenidoEstilo);
                          // Aumenta de fila
                          cualFila = cualFila + 1;
                        });
            
                        //Ruta del archivo
                        const pathExcel = path.join(
                          __dirname,
                          "reportes",
                          nombreArchivo + ".xlsx"
                        );
                        //Escribir o guardar
                        wb.write(pathExcel, function (err, stats) {
                          if (err) console.log(err);
                          else {
                            // Crear función y descargar archivo
                            function downloadFile() {
                              res.download(pathExcel);
                            }
                            downloadFile();
            
                            // Borrar archivo
                            fs.rm(pathExcel, function (err) {
                              if (err) console.log(err);
                              else
                                console.log(
                                  "Archivo descargado y borrado del servidor correctamente"
                                );
                            });
                          }
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } else {
      console.log("fecha" + desde, hasta);
    }
  } catch (error) {}
};

const reporteEstadistico = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    if (formatoFecha.test(desde) && formatoFecha.test(hasta)) {
      connection.query(
        "DROP TEMPORARY TABLE IF EXISTS ESTADISTICA;",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            connection.query(
              "CREATE TEMPORARY TABLE ESTADISTICA AS( SELECT B.ID_BENEFICIARIO, E.NOMBRE AS EMPRESA, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD FROM SESIONES_BENEFICIARIO SB INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE FECHA BETWEEN ? AND ? GROUP BY ID_BENEFICIARIO, EMPRESA, SEXO, EDAD );",
              [desde, hasta],
              (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  connection.query(
                    `SELECT
                                    EMPRESA, 
                                    CASE
                                      WHEN EDAD >= 0 AND EDAD <= 16 THEN '0-16'
                                      WHEN EDAD >= 17 AND EDAD <= 30 THEN '17-30'
                                      WHEN EDAD >= 31 AND EDAD <= 47 THEN '31-47'
                                      WHEN EDAD >= 48 THEN '48+'
                                    END AS RANGO,
                                    COUNT(CASE WHEN SEXO = 'M' THEN 1 END) AS HOMBRES,
                                    COUNT(CASE WHEN SEXO = 'F' THEN 1 END) AS MUJERES
                                  FROM ESTADISTICA 
                                  WHERE EDAD >= 0 AND EDAD <= 48
                                  GROUP BY EMPRESA, RANGO;`,
                    (error, results) => {
                      if (error) {
                        console.log(error);
                      } else {
                        res.json(results);
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } else {
      res.json({ mensaje: "formato de fecha incorrecto" });
    }
  } catch (error) {}
};

const excelReporteEstadistico = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    if (formatoFecha.test(desde) && formatoFecha.test(hasta)) {
      connection.query(
        "DROP TEMPORARY TABLE IF EXISTS ESTADISTICA;",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            connection.query(
              "CREATE TEMPORARY TABLE ESTADISTICA AS( SELECT B.ID_BENEFICIARIO, E.NOMBRE AS EMPRESA, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD FROM SESIONES_BENEFICIARIO SB INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE FECHA BETWEEN ? AND ? GROUP BY ID_BENEFICIARIO, EMPRESA, SEXO, EDAD );",
              [desde, hasta],
              (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  connection.query(
                    `SELECT
                                    EMPRESA, 
                                    CASE
                                      WHEN EDAD >= 0 AND EDAD <= 16 THEN '0-16'
                                      WHEN EDAD >= 17 AND EDAD <= 30 THEN '17-30'
                                      WHEN EDAD >= 31 AND EDAD <= 47 THEN '31-47'
                                      WHEN EDAD >= 48 THEN '48+'
                                    END AS RANGO,
                                    COUNT(CASE WHEN SEXO = 'M' THEN 1 END) AS HOMBRES,
                                    COUNT(CASE WHEN SEXO = 'F' THEN 1 END) AS MUJERES
                                  FROM ESTADISTICA 
                                  WHERE EDAD >= 0 AND EDAD <= 48
                                  GROUP BY EMPRESA, RANGO;`,
                    (error, results) => {
                      if (error) {
                        console.log(error);
                      } else {
                        var options = {
                          margins: {
                            left: 1.5,
                            right: 1.5,
                          },
                        };
                        // Configurar excel4node
                        // Create a new instance of a Workbook class
                        var wb = new xl.Workbook();
                        let nombreArchivo = "ReporteEstadistico";
                        var ws = wb.addWorksheet(nombreArchivo,options);
            
                        // Crear estilos
                        var cualColumnaEstilo = wb.createStyle({
                          font: {
                            name: "Times New Roman",
                            color: "#1C2833",
                            size: 12,
                            bold: true,
                          },
                        });
            
                        var contenidoEstilo = wb.createStyle({
                          font: {
                            name: "Times New Roman",
                            color: "#494949",
                            size: 11,
                          },
                        });
                        var contenidoEncabezaodo = wb.createStyle({
                            font:{
                                name:"Times New Roman",
                                color:"#EC7063",
                                size: 16
                            }
                        });
                         
                          //Nombres de las columnas
                          ws.cell(2,3,2,7,true).string("REPORTE ESTADISTICO AMOR DOWN").style(contenidoEncabezaodo);
                          ws.cell(2,8,2,9,true).string(`DESDE: ${desde}`).style(contenidoEncabezaodo);
                          ws.cell(2,10,2,11,true).string(`HASTA: ${hasta}`).style(contenidoEncabezaodo);
                          ws.cell(4, 1).string("EMPRESA").style(cualColumnaEstilo);
                          ws.cell(4, 2).string("RANGO").style(cualColumnaEstilo);
                          ws.cell(4, 3).string("HOMBRES").style(cualColumnaEstilo);
                          ws.cell(4, 4).string("MUJERES").style(cualColumnaEstilo);
                          let cualFila = 5;
                          results.forEach((datos) => {
                            ws.cell(cualFila, 1).string(datos.EMPRESA).style(contenidoEstilo);
                            ws.cell(cualFila, 2).string(datos.RANGO).style(contenidoEstilo);
                            ws.cell(cualFila, 3).number(datos.HOMBRES).style(contenidoEstilo);
                            ws.cell(cualFila, 4).number(datos.MUJERES).style(contenidoEstilo);
                            // Aumenta de fila
                            cualFila = cualFila + 1;
                          });
                          //Ruta del archivo
                        const pathExcel = path.join(
                          __dirname,
                          "reportes",
                          nombreArchivo + ".xlsx"
                        );
                        //Escribir o guardar
                        wb.write(pathExcel, function (err, stats) {
                          if (err) console.log(err);
                          else {
                            // Crear función y descargar archivo
                            function downloadFile() {
                              res.download(pathExcel);
                            }
                            downloadFile();
            
                            // Borrar archivo
                            fs.rm(pathExcel, function (err) {
                              if (err) console.log(err);
                              else
                                console.log(
                                  "Archivo descargado y borrado del servidor correctamente"
                                );
                            });
                          }
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } else {
      res.json({ mensaje: "formato de fecha incorrecto" });
    }
  } catch (error) {}
};

const reporteCualitativo = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    if (formatoFecha.test(desde) && formatoFecha.test(hasta)) {
      connection.query(
        "DROP TEMPORARY TABLE IF EXISTS CUALITATIVO;",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            connection.query(
              `CREATE TEMPORARY TABLE CUALITATIVO AS (
                            SELECT B.ID_BENEFICIARIO, E.NOMBRE AS EMPRESA, A.NOMBRE AS AREA, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD  
                            FROM SESIONES_BENEFICIARIO SB
                            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
                            INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
                            INNER JOIN USUARIOS U ON SB.ID_USUARIO = U.ID
                            INNER JOIN AREAS_USUARIOS AU ON U.ID = AU.ID_USUARIOS
                            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
                            WHERE FECHA BETWEEN ? AND ?
                            GROUP BY ID_BENEFICIARIO, EMPRESA, AREA, SEXO, EDAD
                          );`,
              [desde, hasta],
              (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  connection.query(
                    `SELECT
                                EMPRESA, 
                                CASE
                                  WHEN EDAD >= 0 AND EDAD <= 16 THEN '0-16'
                                  WHEN EDAD >= 17 AND EDAD <= 30 THEN '17-30'
                                  WHEN EDAD >= 31 AND EDAD <= 47 THEN '31-47'
                                  WHEN EDAD >= 48 THEN '48+'
                                END AS RANGO,
                                COUNT(CASE WHEN SEXO = 'M' THEN 1 END) AS HOMBRES,
                                COUNT(CASE WHEN SEXO = 'F' THEN 1 END) AS MUJERES
                              FROM CUALITATIVO 
                              WHERE SEXO IN ('M', 'F') AND EDAD >= 0 AND EDAD <= 150
                              GROUP BY EMPRESA, RANGO;`,
                    (error, results) => {
                      if (error) {
                        console.log(error);
                      } else {
                        res.json(results);
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } else {
      res.json({ mensaje: "formato de fecha incorrecto" });
    }
  } catch (error) {}
};

const excelReporteCualitativo = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    if (formatoFecha.test(desde) && formatoFecha.test(hasta)) {
      connection.query(
        "DROP TEMPORARY TABLE IF EXISTS CUALITATIVO;",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            connection.query(
              `CREATE TEMPORARY TABLE CUALITATIVO AS (
                            SELECT B.ID_BENEFICIARIO, E.NOMBRE AS EMPRESA, A.NOMBRE AS AREA, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD  
                            FROM SESIONES_BENEFICIARIO SB
                            INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
                            INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
                            INNER JOIN USUARIOS U ON SB.ID_USUARIO = U.ID
                            INNER JOIN AREAS_USUARIOS AU ON U.ID = AU.ID_USUARIOS
                            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
                            WHERE FECHA BETWEEN ? AND ?
                            GROUP BY ID_BENEFICIARIO, EMPRESA, AREA, SEXO, EDAD
                          );`,
              [desde, hasta],
              (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  connection.query(
                    `SELECT
                                EMPRESA, 
                                CASE
                                  WHEN EDAD >= 0 AND EDAD <= 16 THEN '0-16'
                                  WHEN EDAD >= 17 AND EDAD <= 30 THEN '17-30'
                                  WHEN EDAD >= 31 AND EDAD <= 47 THEN '31-47'
                                  WHEN EDAD >= 48 THEN '48+'
                                END AS RANGO,
                                COUNT(CASE WHEN SEXO = 'M' THEN 1 END) AS HOMBRES,
                                COUNT(CASE WHEN SEXO = 'F' THEN 1 END) AS MUJERES
                              FROM CUALITATIVO 
                              WHERE SEXO IN ('M', 'F') AND EDAD >= 0 AND EDAD <= 150
                              GROUP BY EMPRESA, RANGO;`,
                    (error, results) => {
                      if (error) {
                        console.log(error);
                      } else {
                        var options = {
                          margins: {
                            left: 1.5,
                            right: 1.5,
                          },
                        };
                        // Configurar excel4node
                        // Create a new instance of a Workbook class
                        var wb = new xl.Workbook();
                        let nombreArchivo = "ReporteCualitativo";
                        var ws = wb.addWorksheet(nombreArchivo,options);
            
                        // Crear estilos
                        var cualColumnaEstilo = wb.createStyle({
                          font: {
                            name: "Times New Roman",
                            color: "#1C2833",
                            size: 12,
                            bold: true,
                          },
                        });
            
                        var contenidoEstilo = wb.createStyle({
                          font: {
                            name: "Times New Roman",
                            color: "#494949",
                            size: 11,
                          },
                        });
                        var contenidoEncabezaodo = wb.createStyle({
                            font:{
                                name:"Times New Roman",
                                color:"#EC7063",
                                size: 16
                            }
                        });
                         
                          //Nombres de las columnas
                          ws.cell(2,3,2,7,true).string("REPORTE CUALITATIVO AMOR DOWN").style(contenidoEncabezaodo);
                          ws.cell(2,8,2,9,true).string(`DESDE: ${desde}`).style(contenidoEncabezaodo);
                          ws.cell(2,10,2,11,true).string(`HASTA: ${hasta}`).style(contenidoEncabezaodo);
                          ws.cell(4, 1).string("EMPRESA").style(cualColumnaEstilo);
                          ws.cell(4, 2).string("RANGO").style(cualColumnaEstilo);
                          ws.cell(4, 3).string("HOMBRES").style(cualColumnaEstilo);
                          ws.cell(4, 4).string("MUJERES").style(cualColumnaEstilo);
                          let cualFila = 5;
                          results.forEach((datos) => {
                            ws.cell(cualFila, 1).string(datos.EMPRESA).style(contenidoEstilo);
                            ws.cell(cualFila, 2).string(datos.RANGO).style(contenidoEstilo);
                            ws.cell(cualFila, 3).number(datos.HOMBRES).style(contenidoEstilo);
                            ws.cell(cualFila, 4).number(datos.MUJERES).style(contenidoEstilo);
                            // Aumenta de fila
                            cualFila = cualFila + 1;
                          });
                          //Ruta del archivo
                        const pathExcel = path.join(
                          __dirname,
                          "reportes",
                          nombreArchivo + ".xlsx"
                        );
                        //Escribir o guardar
                        wb.write(pathExcel, function (err, stats) {
                          if (err) console.log(err);
                          else {
                            // Crear función y descargar archivo
                            function downloadFile() {
                              res.download(pathExcel);
                            }
                            downloadFile();
            
                            // Borrar archivo
                            fs.rm(pathExcel, function (err) {
                              if (err) console.log(err);
                              else
                                console.log(
                                  "Archivo descargado y borrado del servidor correctamente"
                                );
                            });
                          }
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } else {
      res.json({ mensaje: "formato de fecha incorrecto" });
    }
  } catch (error) {}
};
const reporteInformeServicio = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    //   if(formatoFecha.test(desde) && formatoFecha.test(hasta)){
    connection.query(
      `SELECT A.NOMBRE AS AREA, COUNT(DISTINCT ID_BENEFICIARIO) AS BENEFICIARIOS_ATENDIDOS, COUNT(ID_SESION_BENEFICIARIO) AS TERAPIAS_BRINDADAS, MONTHNAME(FECHA) MES FROM SESIONES_BENEFICIARIO SB
            INNER JOIN USUARIOS U ON SB.ID_USUARIO = U.ID
            INNER JOIN AREAS_USUARIOS AU ON U.ID = AU.ID_USUARIOS
            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
            WHERE FECHA >= ? AND FECHA <= ?
            GROUP BY AREA, MES
            ORDER BY MES DESC;`,
      [desde, hasta],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json(results);
        }
      }
    );
    //   }else{
    //  res.json({mensaje:"formato de fecha incorrecto"});
    //    }
  } catch (error) {}
};

const excelReporteInformeServicio = (req, res) => {
  const { desde, hasta } = req.body;
  const formatoFecha = /^\d{4}-\d{2}-\d{2}$/; //regex para validar que la fecha venga año mes dia.
  try {
    //   if(formatoFecha.test(desde) && formatoFecha.test(hasta)){
    connection.query(
      `SELECT A.NOMBRE AS AREA, COUNT(DISTINCT ID_BENEFICIARIO) AS BENEFICIARIOS_ATENDIDOS, COUNT(ID_SESION_BENEFICIARIO) AS TERAPIAS_BRINDADAS, MONTHNAME(FECHA) MES FROM SESIONES_BENEFICIARIO SB
            INNER JOIN USUARIOS U ON SB.ID_USUARIO = U.ID
            INNER JOIN AREAS_USUARIOS AU ON U.ID = AU.ID_USUARIOS
            INNER JOIN AREAS A ON AU.ID_AREA = A.ID_AREA
            WHERE FECHA >= ? AND FECHA <= ?
            GROUP BY AREA, MES
            ORDER BY MES DESC;`,
      [desde, hasta],
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          var options = {
            margins: {
              left: 1.5,
              right: 1.5,
            },
          };
          // Configurar excel4node
          // Create a new instance of a Workbook class
          var wb = new xl.Workbook();
          let nombreArchivo = "ReporteInformeServicios";
          var ws = wb.addWorksheet(nombreArchivo,options);

          // Crear estilos
          var cualColumnaEstilo = wb.createStyle({
            font: {
              name: "Times New Roman",
              color: "#1C2833",
              size: 12,
              bold: true,
            },
          });

          var contenidoEstilo = wb.createStyle({
            font: {
              name: "Times New Roman",
              color: "#494949",
              size: 11,
            },
          });
          var contenidoEncabezaodo = wb.createStyle({
              font:{
                  name:"Times New Roman",
                  color:"#EC7063",
                  size: 16
              }
          });
           
            //Nombres de las columnas
            ws.cell(2,3,2,7,true).string("REPORTE DE SERVICIOS AMOR DOWN").style(contenidoEncabezaodo);
            ws.cell(2,8,2,9,true).string(`DESDE: ${desde}`).style(contenidoEncabezaodo);
            ws.cell(2,10,2,11,true).string(`HASTA: ${hasta}`).style(contenidoEncabezaodo);
            ws.cell(4, 1).string("AREA").style(cualColumnaEstilo);
            ws.cell(4, 2).string("BENEFICIARIOS_ATENDIDOS").style(cualColumnaEstilo);
            ws.cell(4, 3).string("TERAPIAS_BRINDADAS").style(cualColumnaEstilo);
            ws.cell(4, 4).string("MES").style(cualColumnaEstilo);
            let cualFila = 5;
            results.forEach((datos) => {
              ws.cell(cualFila, 1).string(datos.AREA).style(contenidoEstilo);
              ws.cell(cualFila, 2).number(datos.BENEFICIARIOS_ATENDIDOS).style(contenidoEstilo);
              ws.cell(cualFila, 3).number(datos.TERAPIAS_BRINDADAS).style(contenidoEstilo);
              ws.cell(cualFila, 4).string(datos.MES).style(contenidoEstilo);
              // Aumenta de fila
              cualFila = cualFila + 1;
            });
            //Ruta del archivo
          const pathExcel = path.join(
            __dirname,
            "reportes",
            nombreArchivo + ".xlsx"
          );
          //Escribir o guardar
          wb.write(pathExcel, function (err, stats) {
            if (err) console.log(err);
            else {
              // Crear función y descargar archivo
              function downloadFile() {
                res.download(pathExcel);
              }
              downloadFile();

              // Borrar archivo
              fs.rm(pathExcel, function (err) {
                if (err) console.log(err);
                else
                  console.log(
                    "Archivo descargado y borrado del servidor correctamente"
                  );
              });
            }
          });
        }
      }
    );
    //   }else{
    //  res.json({mensaje:"formato de fecha incorrecto"});
    //    }
  } catch (error) {}
};

module.exports = {
  sesionsForAreas,
  sesionsForBeneficiary,
  reporteCuantitativo,
  reporteF9,
  reporteEstadistico,
  reporteCualitativo,
  reporteInformeServicio,
  excelReporteCuantitativo,
  excelReporteF9,
  excelReporteEstadistico,
  excelReporteCualitativo,
  excelReporteInformeServicio
};
