const sequelize = require('../database/connection');
const Usuario  = require('./Usuario');
const Veiculo  = require('./Veiculo');
const Motorista = require('./Motorista');
const Cliente  = require('./Cliente');
const Rota     = require('./Rota');
const Carga    = require('./Carga');
const Viagem   = require('./Viagem');
const Frete    = require('./Frete');

Viagem.belongsTo(Veiculo);
Viagem.belongsTo(Motorista);
Viagem.belongsTo(Rota);
Viagem.belongsTo(Carga);
Viagem.belongsTo(Cliente);
Viagem.hasOne(Frete);

Veiculo.hasMany(Viagem);
Motorista.hasMany(Viagem);
Rota.hasMany(Viagem);
Carga.hasMany(Viagem);
Cliente.hasMany(Viagem);
Frete.belongsTo(Viagem);

module.exports = { sequelize, Usuario, Veiculo, Motorista, Cliente, Rota, Carga, Viagem, Frete };
