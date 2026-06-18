require('dotenv').config();
const { sequelize } = require('./models');
const popular = require('./seedData');

// Seed manual para desenvolvimento: recria o schema e popula tudo.
async function seed() {
  await sequelize.sync({ force: true });
  console.log('Banco recriado...');

  await popular();

  console.log('\n========================================');
  console.log('SEED CONCLUÍDO! Dados de acesso:');
  console.log('  admin       / admin123  (Administrador)');
  console.log('  gestor      / gestor123 (Gestor de Transporte)');
  console.log('  financeiro  / fin123    (Financeiro)');
  console.log('  joao.mot    / mot123    (Motorista)');
  console.log('  maria.mot   / mot123    (Motorista)');
  console.log('========================================\n');

  await sequelize.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
