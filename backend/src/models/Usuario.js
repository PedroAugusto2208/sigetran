const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Usuario = sequelize.define('Usuario', {
  login: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  senha: { type: DataTypes.STRING(255), allowNull: false },
  nome:  { type: DataTypes.STRING(200), allowNull: false },
  tipo:  {
    type: DataTypes.ENUM('ADMINISTRADOR', 'GESTOR_TRANSPORTE', 'MOTORISTA', 'FINANCEIRO'),
    allowNull: false,
  },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'usuarios' });

module.exports = Usuario;
