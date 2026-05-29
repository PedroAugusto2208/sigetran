const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Veiculo = sequelize.define('Veiculo', {
  placa:           { type: DataTypes.STRING(10),  allowNull: false, unique: true },
  modelo:          { type: DataTypes.STRING(100), allowNull: false },
  marca:           { type: DataTypes.STRING(100), allowNull: false },
  anoFabricacao:   { type: DataTypes.INTEGER,     allowNull: false },
  capacidadeCarga: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  ativo:           { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'veiculos' });

module.exports = Veiculo;
