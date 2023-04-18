const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../Database/bd");
const { Model } = require("sequelize");

const User = sequelize.define(
    'usuario',
  {
    email: {
      type: Sequelize.STRING,
    },
    nombre: {
      type: Sequelize.STRING,
    },
    nit: {
      type: Sequelize.STRING,
    },
    DPI: { 
        type: Sequelize.STRING 
    },
    direccion: { 
        type: Sequelize.STRING 
    },
    telefono: { 
        type: Sequelize.STRING 
    },
    id_roles: { 
        type: DataTypes.INTEGER 
    },
    CONTRASEÑA: { 
        type: DataTypes.STRING 
    }
  },
  {
    timestamps: false
  }
);

module.exports = {
  User,
};
