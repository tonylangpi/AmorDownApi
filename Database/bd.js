const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

const config = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: {
    ca: fs.readFileSync(path.resolve(__dirname, 'ca.pem')).toString(),
    rejectUnauthorized: true,
  }
};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(path.resolve(__dirname, 'ca.pem')).toString(),
      rejectUnauthorized: true,
    }
  }
});

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  ssl: {
    ca: fs.readFileSync(path.resolve(__dirname, 'ca.pem')).toString(),
    rejectUnauthorized: true,
  }
});

sequelize.authenticate().then(() => {
  console.log('Conexion satisfactoria a mysql');
}).catch((error) => {
  console.error('no se pudo conectar ', error);
});

module.exports = { sequelize, connection };
