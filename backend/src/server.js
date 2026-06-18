require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const popular = require('./seedData');

const PORT = process.env.PORT || 3001;

async function iniciar() {
  await sequelize.sync();

  // Popula dados de demonstração se o banco estiver vazio.
  // Importante em hospedagens com disco efêmero (ex.: Render free),
  // onde o banco é recriado a cada deploy/restart.
  const criou = await popular();
  if (criou) console.log('Dados de demonstração criados (admin / admin123).');

  app.listen(PORT, () => console.log(`SIGETRAN API rodando na porta ${PORT}`));
}

iniciar().catch(console.error);
