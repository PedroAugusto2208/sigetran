process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const { sequelize } = require('../src/models');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Usuario.create({
    login: 'admin',
    senha: await bcrypt.hash('admin123', 10),
    nome:  'Admin Teste',
    tipo:  'ADMINISTRADOR',
  });
  await Usuario.create({
    login: 'motorista1',
    senha: await bcrypt.hash('mot123', 10),
    nome:  'Motorista Teste',
    tipo:  'MOTORISTA',
  });
});

afterAll(async () => {
  await sequelize.close();
});
