const { sequelize, connection } = require("../Database/bd");
const fs = require("fs");
const xl = require("excel4node");
const path = require("path");
const jwt = require("jsonwebtoken");
const { json } = require("sequelize");



const sesionsForBeneficiary = async (req, res) => {
  const { Beneficiario, Usuario } = req.body;
  console.log(Beneficiario + ' ' + Usuario)

  connection.query("SELECT SB.ID_BENEFICIARIO, B.NOMBRES, B.APELLIDOS, GROUP_CONCAT( distinct SB.ACTIVIDAD SEPARATOR ', ') AS ACTIVIDAD, GROUP_CONCAT( distinct SB.EVOLUCION SEPARATOR '. ') AS EVOLUCION, SB.FECHA, A.NOMBRE AS AREA, SB.ACOMPAÑAMIENTO FROM SESIONES_BENEFICIARIO SB INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN AREAS A ON SB.ID_AREA = A.ID_AREA WHERE SB.ID_USUARIO = ? AND SB.ID_BENEFICIARIO = ? GROUP BY B.NOMBRES, B.APELLIDOS, SB.FECHA, AREA, SB.ACOMPAÑAMIENTO", [Usuario, Beneficiario], (err, result) => {
    if(err){
      res.json({message:"No se encontraron datos"})
    } else {
      res.json(result)
    }
  })
  
};

const reporteF9 = (req, res) => {
  const { Mes, Anio } = req.body;
  try {
    if (Mes, Anio) {
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
                  E.CODIGO,
                  B.CORRELATIVO,
                  B.ID_BENEFICIARIO,
                  B.NOMBRES,
                  B.APELLIDOS, 
                  B.DEPARTAMENTO,
                  B.MUNICIPIO,
                  B.SEXO,
                  TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD, 
                  B.PUEBLO,
                  HC.DISCAPACIDAD, 
                  B.ESCOLARIDAD, 
                  SB.TIPO_SESION, 
                  HC.DIAGNOSTICO, 
                  A.NOMBRE AS SERVICIO_RECIBIDO
                FROM SESIONES_BENEFICIARIO SB
                INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO
                INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA
                INNER JOIN HISTORIAL_CLINICO HC ON B.ID_BENEFICIARIO = HC.ID_BENEFICIARIO 
                INNER JOIN AREAS A ON SB.ID_AREA = A.ID_AREA
                WHERE MONTH(SB.FECHA) = ? AND YEAR(SB.FECHA) = ?
                GROUP BY FECHA, REFERENCIA, CORRELATIVO, NOMBRES, APELLIDOS, SEXO, EDAD, DISCAPACIDAD, ESCOLARIDAD, TIPO_SESION, DIAGNOSTICO, SERVICIO_RECIBIDO, CODIGO, DEPARTAMENTO, MUNICIPIO, PUEBLO, B.ID_BENEFICIARIO
              );`,
              [Mes, Anio],
              (error, results) => {
                if (error) {
                  console.log(error);
                } else {
                  connection.query(
                    `SELECT 
                    GROUP_CONCAT(DISTINCT DAY(FECHA) SEPARATOR ', ') AS FECHA_DIAS,
                    REFERENCIA, 
                    CODIGO,
                    CORRELATIVO,
                    NOMBRES, 
                    APELLIDOS, 
                    DEPARTAMENTO,
                    MUNICIPIO,
                    SEXO, 
                    EDAD, 
                    PUEBLO,
                    DISCAPACIDAD, 
                    ESCOLARIDAD, 
                    GROUP_CONCAT(DISTINCT TIPO_SESION SEPARATOR ', ') AS TIPO_SESION,
                    DIAGNOSTICO, 
                    GROUP_CONCAT(DISTINCT SERVICIO_RECIBIDO SEPARATOR ', ') AS SERVICIO_RECIBIDO  
                  FROM INFORME
                  GROUP BY REFERENCIA, NOMBRES, APELLIDOS, SEXO, EDAD, DISCAPACIDAD, ESCOLARIDAD, DIAGNOSTICO, CODIGO, CORRELATIVO, DEPARTAMENTO, MUNICIPIO, PUEBLO, ID_BENEFICIARIO;`,
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

const reporteF8 = (req, res) => {
  const {Cuatrimestre, Anio} = req.body 
try{
  connection.query("DROP TEMPORARY TABLE IF EXISTS REPORTEF8", (errDrop, resultDrop) => {
    if (errDrop) {
      console.log(errDrop);
    } else {
      connection.query(
        "CREATE TEMPORARY TABLE REPORTEF8 AS (SELECT ID_BENEFICIARIO, COUNT(ID_SESION) AS TOTAL, ID_AREA, FECHA FROM SESIONES_BENEFICIARIO GROUP BY ID_AREA, FECHA, ID_BENEFICIARIO);",
        (errCreate, resultCreate) => {
          if (errCreate) {
            console.log(errCreate);
          } else {
            if (Cuatrimestre === '1') {
              connection.query(
                "SELECT SUM( XD.TOTAL) AS TOTAL_AREAS, COUNT(distinct XD.ID_BENEFICIARIO) AS TOTAL_BENES, A.NOMBRE AS AREA, MONTH(XD.FECHA) AS MES FROM REPORTEF8 XD INNER JOIN AREAS A ON XD.ID_AREA = A.ID_AREA WHERE MONTH(FECHA) BETWEEN 1 AND 4 AND YEAR(FECHA) = ? group by AREA, MES",
                [Anio],
                (errSelect, resultSelect) => {
                  if (errSelect) {
                    console.log(errSelect);
                  } else {
                    res.json(resultSelect);
                  }
                })} else if(Cuatrimestre === '2'){
            connection.query("SELECT SUM( XD.TOTAL)AS TOTAL_AREAS, COUNT(distinct XD.ID_BENEFICIARIO) AS TOTAL_BENES, A.NOMBRE AS AREA, MONTH(XD.FECHA) AS MES FROM REPORTEF8 XD INNER JOIN AREAS A ON XD.ID_AREA = A.ID_AREA WHERE MONTH(FECHA) BETWEEN 5 AND 8 AND YEAR(FECHA) = ? group by AREA, MES", [Anio], (erro, result)=>{
              if(erro){
                console.log(erro)
              } else {
                res.json(result)
              }
            })
          } else if(Cuatrimestre === '3'){
            connection.query("SELECT SUM( XD.TOTAL) AS TOTAL_AREAS, COUNT(distinct XD.ID_BENEFICIARIO) AS TOTAL_BENES, A.NOMBRE AS AREA, MONTH(XD.FECHA) AS MES FROM REPORTEF8 XD INNER JOIN AREAS A ON XD.ID_AREA = A.ID_AREA WHERE MONTH(FECHA) BETWEEN 9 AND 12 AND YEAR(FECHA) = ? group by AREA, MES", [Anio], (erro, result)=>{
              if(erro){
                console.log(erro)
              } else {
                res.json(result)
              }
            })
          }
        }
      })
    }
  })} catch (errorr) {
    console.log(errorr)
  }
}

const reporteCuantitativo = (req, res) => {
  const { Mes, Area, Sede, Anio } = req.body;
  console.log(Mes + Area + Sede)
  try {
    if (Mes && Area && Sede) {
      connection.query(
        `SELECT CONCAT(B.NOMBRES, ' ', B.APELLIDOS) AS NOMBRE_COMPLETO, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD, HC.DIAGNOSTICO, HC.DISCAPACIDAD, COUNT(distinct A.FECHA) AS ASISTENCIA FROM ASISTENCIA A INNER JOIN BENEFICIARIO B ON A.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN HISTORIAL_CLINICO HC ON B.ID_BENEFICIARIO = HC.ID_BENEFICIARIO INNER JOIN SESIONES_BENEFICIARIO SB ON A.ID_BENEFICIARIO = SB.ID_BENEFICIARIO WHERE ID_AREA = ? AND A.FECHA = SB.FECHA AND B.ID_EMPRESA = ? AND MONTH(A.FECHA) = ? AND YEAR(A.FECHA) = ? GROUP BY NOMBRE_COMPLETO, SEXO, EDAD, DIAGNOSTICO, DISCAPACIDAD`,
        [Area, Sede, Mes, Anio],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.json(results);
          }
        }
      );
    } else {
      res.json({ mensaje: "Informacion Incorrecta" });
    }
  } catch (error) {
    res.send(error);
  }
};

const reporteMiEstadistica = (req, res) => {
  const { Mes, Usuario, Anio } = req.body;

  try {
      connection.query(
        "DROP TEMPORARY TABLE IF EXISTS MYESTADISTICA;",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            connection.query(
              "CREATE TEMPORARY TABLE MYESTADISTICA AS( SELECT B.ID_BENEFICIARIO, COUNT(SB.FECHA) AS ASISTENCIAS, E.NOMBRE AS EMPRESA, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD, SB.ID_AREA FROM SESIONES_BENEFICIARIO SB INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE MONTH(FECHA) = ? AND SB.ID_USUARIO = ? AND YEAR(FECHA) = ? GROUP BY ID_BENEFICIARIO, EMPRESA, SEXO, EDAD, ID_AREA);",
              [Mes, Usuario, Anio],
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
					COUNT(DISTINCT CASE WHEN SEXO = 'M' THEN ID_BENEFICIARIO END) AS HOMBRES,
					COUNT(DISTINCT CASE WHEN SEXO = 'F' THEN ID_BENEFICIARIO END) AS MUJERES,
                    SUM(ASISTENCIAS) AS TOTAL_SESIONES
                  FROM MYESTADISTICA 
                  WHERE EDAD >= 0 AND EDAD <= 48
                  GROUP BY EMPRESA, RANGO`,
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
    
  } catch (error) {}
};

const reporteCualitativo = (req, res) => {
  const {Mes, Usuario, Anio} = req.body

  connection.query("SELECT E.CODIGO, B.CORRELATIVO, CONCAT(B.NOMBRES, ' ', B.APELLIDOS) AS NOMBRE_COMPLETO, GROUP_CONCAT(SB.ACTIVIDAD SEPARATOR '. ') AS ACTIVIDAD, GROUP_CONCAT(SB.EVOLUCION SEPARATOR '. ') AS EVOLUCION FROM SESIONES_BENEFICIARIO SB INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE SB.ID_USUARIO = ? AND MONTH(SB.FECHA) = ? AND YEAR(SB.FECHA) = ? GROUP BY CODIGO, NOMBRE_COMPLETO, B.ID_BENEFICIARIO", [Usuario, Mes, Anio], (err, result) => {
    if(err){
      console.log(err)
    } else {
      res.json(result)
    }
  })
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

const sesionsForAreas = (req, res) => {
  const { Mes, Anio } = req.body;
  try{
    if(Mes && Anio){
      connection.query("DROP TEMPORARY TABLE IF EXISTS SERVICIOS;", (error, result) => {
        if(error) {
          console.log(error)
        } else {
          connection.query("CREATE TEMPORARY TABLE SERVICIOS AS (SELECT ID_BENEFICIARIO, COUNT(ID_SESION) AS TOTAL, ID_AREA, FECHA FROM SESIONES_BENEFICIARIO WHERE YEAR(FECHA) = ? AND MONTH(FECHA) = ? GROUP BY ID_AREA, FECHA, ID_BENEFICIARIO);", [Anio, Mes], (error, result) => {
            if(error) {
              console.log(error)
            } else {
              connection.query("SELECT SUM( XD.TOTAL) AS TOTAL_AREAS, COUNT(distinct XD.ID_BENEFICIARIO) AS TOTAL_BENES, A.NOMBRE AS AREA, MONTH(XD.FECHA) AS MES FROM SERVICIOS XD INNER JOIN AREAS A ON XD.ID_AREA = A.ID_AREA group by AREA, MES", (err, response) => {
                if(err) {
                  console.log(err)
                } else {
                  res.json(response)
                }
              })
            }
          })
        }
      })
    } else {
      console.log({message:"Falta Informacion"})
      res.json({message:"Falta Informacion"})
    }

  } catch {

  }
  
};

const Estadistica = (req, res) => {
  const {Mes, Anio} = req.body
  try{
    connection.query("DROP TEMPORARY TABLE IF EXISTS ESTADISTICA;", (error, result) => {
      if(error) {
        console.log(error)
      } else {
        connection.query("CREATE TEMPORARY TABLE ESTADISTICA AS( SELECT B.ID_BENEFICIARIO, E.NOMBRE AS SEDE, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD FROM SESIONES_BENEFICIARIO SB INNER JOIN BENEFICIARIO B ON SB.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE MONTH(FECHA) = ? AND YEAR(FECHA) = ? GROUP BY ID_BENEFICIARIO, SEDE, SEXO, EDAD);", [Mes, Anio], (error, result) => {
          if(error){
            console.log(error)
          } else {
            connection.query("SELECT SEDE, CASE WHEN EDAD >= 0 AND EDAD <= 16 THEN '0-16' WHEN EDAD >= 17 AND EDAD <= 30 THEN '17-30' WHEN EDAD >= 31 AND EDAD <= 47 THEN '31-47' WHEN EDAD >= 48 THEN '48+' END AS RANGO, COUNT(DISTINCT CASE WHEN SEXO = 'M' THEN ID_BENEFICIARIO END) AS HOMBRES, COUNT(DISTINCT CASE WHEN SEXO = 'F' THEN ID_BENEFICIARIO END) AS MUJERES FROM ESTADISTICA WHERE EDAD >= 0 AND EDAD <= 100 GROUP BY SEDE, RANGO;", (error, result) => {
              
              if(error){
                console.log(error)
              } else {
                res.json(result)
              }
            })
          }
        })
      }
    })

  } catch {
      console.log("Error")
  }


}

const Filtros = (req, res) => {
  const {Filtro, Tipo} = req.body 
  if(Tipo === 1) {
    connection.query("SELECT CONCAT(B.NOMBRES, ' ', B.APELLIDOS) AS NOMBRE_COMPLETO, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD, B.CORRELATIVO, E.CODIGO, B.DEPARTAMENTO, B.MUNICIPIO, B.DIRECCION, HC.DIAGNOSTICO FROM HISTORIAL_CLINICO HC INNER JOIN BENEFICIARIO B ON HC.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE HC.DISCAPACIDAD = ? ORDER BY EDAD", [Filtro], (err, result) =>{
      if(err){
        console.log(err)
      } else {
        res.json(result)
      }
  })
  } else if (Tipo===2){
    connection.query("SELECT CONCAT(B.NOMBRES, ' ', B.APELLIDOS) AS NOMBRE_COMPLETO, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD, B.CORRELATIVO, E.CODIGO, B.DEPARTAMENTO, B.MUNICIPIO, B.DIRECCION, HC.DIAGNOSTICO FROM HISTORIAL_CLINICO HC INNER JOIN BENEFICIARIO B ON HC.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE HC.LENTES = 'SI' ORDER BY EDAD", [Filtro], (err, result) =>{
      if(err){
        console.log(err)
      } else {
        res.json(result)
      }
  })
  } else if (Tipo === 3){
    connection.query("SELECT CONCAT(B.NOMBRES, ' ', B.APELLIDOS) AS NOMBRE_COMPLETO, B.SEXO, TIMESTAMPDIFF(YEAR, B.FECHA_NACIMIENTO, CURDATE()) AS EDAD, B.CORRELATIVO, E.CODIGO, B.DEPARTAMENTO, B.MUNICIPIO, B.DIRECCION, HC.DIAGNOSTICO FROM HISTORIAL_CLINICO HC INNER JOIN BENEFICIARIO B ON HC.ID_BENEFICIARIO = B.ID_BENEFICIARIO INNER JOIN EMPRESA E ON B.ID_EMPRESA = E.ID_EMPRESA WHERE HC.APARATO_AUDITIVO = 'SI' ORDER BY EDAD", [Filtro], (err, result) =>{
      if(err){
        console.log(err)
      } else {
        res.json(result)
      }
  })
  }
  
}

module.exports = {
  sesionsForAreas,
  sesionsForBeneficiary,
  reporteCuantitativo,
  reporteF9,
  reporteMiEstadistica,
  reporteCualitativo,
  reporteInformeServicio,
  reporteF8,
  Estadistica, 
  Filtros
};
