const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Carga = sequelize.define('Carga', {
  descricao:      { type: DataTypes.STRING(300), allowNull: false },
  pesoKg:         { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  volumeM3:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  tipoMercadoria: {
    type: DataTypes.ENUM('GERAL', 'PERIGOSA', 'PERECIVEL', 'FRAGIL', 'GRANEL'),
    defaultValue: 'GERAL',
  },
}, { tableName: 'cargas' });

module.exports = Carga;
