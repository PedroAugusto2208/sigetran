require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth',       require('./routes/auth'));
app.use('/veiculos',   require('./routes/veiculos'));
app.use('/motoristas', require('./routes/motoristas'));
app.use('/clientes',   require('./routes/clientes'));
app.use('/rotas',      require('./routes/rotas'));
app.use('/cargas',     require('./routes/cargas'));
app.use('/viagens',    require('./routes/viagens'));
app.use('/fretes',     require('./routes/fretes'));
app.use('/usuarios',   require('./routes/usuarios'));
app.use('/relatorios', require('./routes/relatorios'));

app.get('/health', (_, res) => res.json({ status: 'ok', sistema: 'SIGETRAN' }));

module.exports = app;
