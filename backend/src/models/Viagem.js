const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Viagem = sequelize.define('Viagem', {
  status: {
    type: DataTypes.ENUM('PROGRAMADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'),
    defaultValue: 'PROGRAMADA',
  },
  dataPartida: { type: DataTypes.DATE },
  dataChegada: { type: DataTypes.DATE },
  VeiculoId:   { type: DataTypes.INTEGER, allowNull: false },
  MotoristaId: { type: DataTypes.INTEGER, allowNull: false },
  RotaId:      { type: DataTypes.INTEGER, allowNull: false },
  CargaId:     { type: DataTypes.INTEGER, allowNull: false },
  ClienteId:   { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'viagens' });

module.exports = Viagem;
