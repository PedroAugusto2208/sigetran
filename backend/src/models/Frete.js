const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Frete = sequelize.define('Frete', {
  valorBase:      { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  valorPedagio:   { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  adicionalCarga: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  valorTotal:     { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  ViagemId:       { type: DataTypes.INTEGER, allowNull: false, unique: true },
}, { tableName: 'fretes' });

module.exports = Frete;
