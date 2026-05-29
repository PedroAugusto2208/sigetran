const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Motorista = sequelize.define('Motorista', {
  nome:     { type: DataTypes.STRING(200), allowNull: false },
  cpf:      { type: DataTypes.STRING(14),  allowNull: false, unique: true },
  cnh:      { type: DataTypes.STRING(20),  allowNull: false, unique: true },
  telefone: { type: DataTypes.STRING(20) },
  email:    { type: DataTypes.STRING(200) },
  ativo:    { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'motoristas' });

module.exports = Motorista;
