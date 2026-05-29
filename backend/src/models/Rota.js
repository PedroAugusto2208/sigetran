const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Rota = sequelize.define('Rota', {
  origem:           { type: DataTypes.STRING(200), allowNull: false },
  destino:          { type: DataTypes.STRING(200), allowNull: false },
  distanciaKm:      { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  tempoEstimadoMin: { type: DataTypes.INTEGER },
  valorPedagio:     { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
}, { tableName: 'rotas' });

module.exports = Rota;
