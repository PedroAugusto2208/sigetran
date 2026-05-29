require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Veiculo, Motorista, Cliente, Rota, Carga, Viagem, Frete } = require('./models');
const FreteService = require('./services/FreteService');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Banco recriado...');

  // ===================== USUÁRIOS =====================
  const senhaHash = await bcrypt.hash('admin123', 10);
  const [admin, gestor, financeiro] = await Promise.all([
    Usuario.create({ login: 'admin',     senha: senhaHash, nome: 'Carlos Administrador', tipo: 'ADMINISTRADOR' }),
    Usuario.create({ login: 'gestor',    senha: await bcrypt.hash('gestor123', 10), nome: 'Ana Paula Souza', tipo: 'GESTOR_TRANSPORTE' }),
    Usuario.create({ login: 'financeiro',senha: await bcrypt.hash('fin123', 10),    nome: 'Roberto Financeiro', tipo: 'FINANCEIRO' }),
    Usuario.create({ login: 'joao.mot',  senha: await bcrypt.hash('mot123', 10),    nome: 'João Carlos Silva', tipo: 'MOTORISTA' }),
    Usuario.create({ login: 'maria.mot', senha: await bcrypt.hash('mot123', 10),    nome: 'Maria Aparecida Costa', tipo: 'MOTORISTA' }),
  ]);

  console.log('Usuários criados.');

  // ===================== VEÍCULOS =====================
  const veiculos = await Promise.all([
    Veiculo.create({ placa: 'ABC-1234', modelo: 'Actros 2651', marca: 'Mercedes-Benz', anoFabricacao: 2021, capacidadeCarga: 25000, ativo: true }),
    Veiculo.create({ placa: 'DEF-5678', modelo: 'FH 460',      marca: 'Volvo',          anoFabricacao: 2022, capacidadeCarga: 23000, ativo: true }),
    Veiculo.create({ placa: 'GHI-9012', modelo: 'Constellation 25.390', marca: 'Volkswagen', anoFabricacao: 2020, capacidadeCarga: 20000, ativo: true }),
    Veiculo.create({ placa: 'JKL-3456', modelo: 'TGX 29.520',  marca: 'MAN',            anoFabricacao: 2023, capacidadeCarga: 27000, ativo: true }),
    Veiculo.create({ placa: 'MNO-7890', modelo: 'XF 480',      marca: 'DAF',            anoFabricacao: 2019, capacidadeCarga: 18000, ativo: false }),
  ]);

  console.log('Veículos criados.');

  // ===================== MOTORISTAS =====================
  const motoristas = await Promise.all([
    Motorista.create({ nome: 'João Carlos Silva',    cpf: '123.456.789-01', cnh: '12345678901', telefone: '(34) 98765-4321', email: 'joao.silva@email.com',  ativo: true }),
    Motorista.create({ nome: 'Maria Aparecida Costa',cpf: '234.567.890-12', cnh: '23456789012', telefone: '(34) 97654-3210', email: 'maria.costa@email.com',  ativo: true }),
    Motorista.create({ nome: 'Pedro Henrique Alves', cpf: '345.678.901-23', cnh: '34567890123', telefone: '(34) 96543-2109', email: 'pedro.alves@email.com',  ativo: true }),
    Motorista.create({ nome: 'Lucas Fernando Rocha', cpf: '456.789.012-34', cnh: '45678901234', telefone: '(34) 95432-1098', email: 'lucas.rocha@email.com',  ativo: true }),
    Motorista.create({ nome: 'Antônio Ferreira Neto',cpf: '567.890.123-45', cnh: '56789012345', telefone: '(34) 94321-0987', email: 'antonio.neto@email.com', ativo: false }),
  ]);

  console.log('Motoristas criados.');

  // ===================== CLIENTES =====================
  const clientes = await Promise.all([
    Cliente.create({ nome: 'Supermercados BomPreço LTDA',  cpfCnpj: '12.345.678/0001-90', telefone: '(11) 3456-7890', email: 'logistica@bompreco.com.br',    endereco: 'Av. Paulista, 1000, São Paulo - SP', ativo: true }),
    Cliente.create({ nome: 'Construtora Horizonte S/A',    cpfCnpj: '23.456.789/0001-01', telefone: '(31) 2345-6789', email: 'compras@horizonte.com.br',       endereco: 'Rua das Flores, 500, Belo Horizonte - MG', ativo: true }),
    Cliente.create({ nome: 'Indústria MetalTech LTDA',     cpfCnpj: '34.567.890/0001-12', telefone: '(43) 3456-7890', email: 'suprimentos@metaltech.com.br',   endereco: 'Rod. BR-369, km 50, Londrina - PR', ativo: true }),
    Cliente.create({ nome: 'Farmacêutica Saúde Total',     cpfCnpj: '45.678.901/0001-23', telefone: '(62) 4567-8901', email: 'logistica@saudetotal.com.br',    endereco: 'Av. Goiás, 2000, Goiânia - GO', ativo: true }),
    Cliente.create({ nome: 'Exportadora Grãos do Cerrado', cpfCnpj: '56.789.012/0001-34', telefone: '(64) 5678-9012', email: 'operacoes@graoscerrado.com.br',  endereco: 'Rod. GO-020, km 12, Rio Verde - GO', ativo: true }),
  ]);

  console.log('Clientes criados.');

  // ===================== ROTAS =====================
  const rotas = await Promise.all([
    Rota.create({ origem: 'Uberlândia - MG',   destino: 'São Paulo - SP',        distanciaKm: 580,  tempoEstimadoMin: 420, valorPedagio: 120.50 }),
    Rota.create({ origem: 'Uberlândia - MG',   destino: 'Belo Horizonte - MG',   distanciaKm: 390,  tempoEstimadoMin: 280, valorPedagio: 65.00  }),
    Rota.create({ origem: 'Uberlândia - MG',   destino: 'Goiânia - GO',          distanciaKm: 320,  tempoEstimadoMin: 240, valorPedagio: 42.00  }),
    Rota.create({ origem: 'Uberlândia - MG',   destino: 'Londrina - PR',         distanciaKm: 680,  tempoEstimadoMin: 490, valorPedagio: 155.00 }),
    Rota.create({ origem: 'São Paulo - SP',     destino: 'Rio de Janeiro - RJ',   distanciaKm: 430,  tempoEstimadoMin: 330, valorPedagio: 98.50  }),
    Rota.create({ origem: 'Uberlândia - MG',   destino: 'Rio Verde - GO',        distanciaKm: 415,  tempoEstimadoMin: 300, valorPedagio: 55.00  }),
  ]);

  console.log('Rotas criadas.');

  // ===================== CARGAS =====================
  const cargas = await Promise.all([
    Carga.create({ descricao: 'Produtos alimentícios — feijão e arroz', pesoKg: 18000, volumeM3: 42, tipoMercadoria: 'GERAL' }),
    Carga.create({ descricao: 'Materiais de construção — cimento e vergalhão', pesoKg: 22000, volumeM3: 30, tipoMercadoria: 'GRANEL' }),
    Carga.create({ descricao: 'Peças automotivas — motores e câmbios', pesoKg: 12000, volumeM3: 28, tipoMercadoria: 'FRAGIL' }),
    Carga.create({ descricao: 'Medicamentos refrigerados', pesoKg: 3500, volumeM3: 12, tipoMercadoria: 'PERECIVEL' }),
    Carga.create({ descricao: 'Produtos químicos industriais', pesoKg: 15000, volumeM3: 20, tipoMercadoria: 'PERIGOSA' }),
    Carga.create({ descricao: 'Soja em grão — safra 2025', pesoKg: 24000, volumeM3: 55, tipoMercadoria: 'GRANEL' }),
    Carga.create({ descricao: 'Eletrônicos — televisores e notebooks', pesoKg: 4500, volumeM3: 35, tipoMercadoria: 'FRAGIL' }),
  ]);

  console.log('Cargas criadas.');

  // ===================== VIAGENS + FRETES =====================
  async function criarViagem(veiculoIdx, motoristaIdx, rotaIdx, cargaIdx, clienteIdx, status, diasAtras) {
    const veiculo  = veiculos[veiculoIdx];
    const motorista = motoristas[motoristaIdx];
    const rota     = rotas[rotaIdx];
    const carga    = cargas[cargaIdx];
    const cliente  = clientes[clienteIdx];

    const dataBase = new Date();
    dataBase.setDate(dataBase.getDate() - diasAtras);

    const viagem = await Viagem.create({
      VeiculoId:   veiculo.id,
      MotoristaId: motorista.id,
      RotaId:      rota.id,
      CargaId:     carga.id,
      ClienteId:   cliente.id,
      status,
      dataPartida: status !== 'PROGRAMADA' ? dataBase : null,
      dataChegada: status === 'CONCLUIDA'  ? new Date(dataBase.getTime() + Number(rota.tempoEstimadoMin) * 60000) : null,
    });

    const calculado = FreteService.calcular({
      distanciaKm:     Number(rota.distanciaKm),
      valorPedagio:    Number(rota.valorPedagio),
      pesoKg:          Number(carga.pesoKg),
      capacidadeCarga: Number(veiculo.capacidadeCarga),
      tipoMercadoria:  carga.tipoMercadoria,
    });

    await Frete.create({ ...calculado, ViagemId: viagem.id });
    return viagem;
  }

  await criarViagem(0, 0, 0, 0, 0, 'CONCLUIDA',    15);  // SP — alimentos
  await criarViagem(1, 1, 3, 1, 2, 'CONCLUIDA',    12);  // Londrina — cimento
  await criarViagem(2, 2, 1, 2, 1, 'CONCLUIDA',     8);  // BH — peças
  await criarViagem(0, 3, 5, 5, 4, 'CONCLUIDA',     5);  // Rio Verde — soja
  await criarViagem(1, 0, 4, 6, 0, 'CONCLUIDA',     3);  // RJ — eletrônicos
  await criarViagem(3, 1, 2, 3, 3, 'EM_ANDAMENTO',  1);  // Goiânia — medicamentos
  await criarViagem(2, 2, 0, 4, 2, 'EM_ANDAMENTO',  0);  // SP — químicos
  await criarViagem(0, 3, 1, 0, 1, 'PROGRAMADA',   -2);  // BH — alimentos
  await criarViagem(1, 1, 3, 1, 2, 'PROGRAMADA',   -3);  // Londrina — cimento
  await criarViagem(3, 2, 5, 5, 4, 'PROGRAMADA',   -5);  // Rio Verde — soja

  console.log('Viagens e fretes criados.');
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
