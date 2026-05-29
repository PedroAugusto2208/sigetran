const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Cliente = sequelize.define('Cliente', {
  nome:     { type: DataTypes.STRING(200), allowNull: false },
  cpfCnpj:  { type: DataTypes.STRING(18),  allowNull: false, unique: true },
  telefone: { type: DataTypes.STRING(20) },
  email:    { type: DataTypes.STRING(200) },
  endereco: { type: DataTypes.STRING(300) },
  ativo:    { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'clientes' });

module.exports = Cliente;
