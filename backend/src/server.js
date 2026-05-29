require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const bcrypt = require('bcryptjs');
const { Usuario } = require('./models');

const PORT = process.env.PORT || 3001;

async function iniciar() {
  await sequelize.sync();

  // Seed: admin padrão se não existir
  const existe = await Usuario.findOne({ where: { login: 'admin' } });
  if (!existe) {
    await Usuario.create({
      login: 'admin',
      senha: await bcrypt.hash('admin123', 10),
      nome:  'Administrador',
      tipo:  'ADMINISTRADOR',
    });
    console.log('Usuário admin criado: login=admin / senha=admin123');
  }

  app.listen(PORT, () => console.log(`SIGETRAN API rodando na porta ${PORT}`));
}

iniciar().catch(console.error);
