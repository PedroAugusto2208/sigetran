const request = require('supertest');
const app = require('../src/app');
const { Veiculo, Motorista, Cliente, Rota, Carga } = require('../src/models');

require('./setup');

let token;
let veiculoId, motoristaId, clienteId, rotaId, cargaId;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ login: 'admin', senha: 'admin123' });
  token = res.body.token;

  const [v, m, c, r, ca] = await Promise.all([
    Veiculo.create({ placa: 'VIA1234', modelo: 'Actros', marca: 'MB', anoFabricacao: 2022, capacidadeCarga: 20000 }),
    Motorista.create({ nome: 'João Silva', cpf: '111.111.111-11', cnh: '111111111' }),
    Cliente.create({ nome: 'Empresa ABC', cpfCnpj: '12.345.678/0001-99' }),
    Rota.create({ origem: 'São Paulo', destino: 'Rio de Janeiro', distanciaKm: 430, valorPedagio: 80 }),
    Carga.create({ descricao: 'Eletrônicos', pesoKg: 5000, volumeM3: 20, tipoMercadoria: 'FRAGIL' }),
  ]);
  veiculoId  = v.id;
  motoristaId = m.id;
  clienteId  = c.id;
  rotaId     = r.id;
  cargaId    = ca.id;
});

describe('POST /viagens', () => {
  it('cria viagem e frete automaticamente', async () => {
    const res = await request(app)
      .post('/viagens')
      .set('Authorization', `Bearer ${token}`)
      .send({ VeiculoId: veiculoId, MotoristaId: motoristaId, RotaId: rotaId, CargaId: cargaId, ClienteId: clienteId });

    expect(res.status).toBe(201);
    expect(res.body.viagem.status).toBe('PROGRAMADA');
    expect(res.body.frete.valorTotal).toBeGreaterThan(0);
    expect(res.body.frete.ViagemId).toBe(res.body.viagem.id);
  });

  it('retorna 409 ao alocar veículo já em viagem ativa', async () => {
    const res = await request(app)
      .post('/viagens')
      .set('Authorization', `Bearer ${token}`)
      .send({ VeiculoId: veiculoId, MotoristaId: motoristaId, RotaId: rotaId, CargaId: cargaId, ClienteId: clienteId });

    expect(res.status).toBe(409);
  });
});

describe('PATCH /viagens/:id/status', () => {
  let viagemId;

  beforeAll(async () => {
    const v2 = await Veiculo.create({ placa: 'STS5678', modelo: 'FH', marca: 'Volvo', anoFabricacao: 2021, capacidadeCarga: 15000 });
    const m2 = await Motorista.create({ nome: 'Maria Costa', cpf: '222.222.222-22', cnh: '222222222' });
    const res = await request(app)
      .post('/viagens')
      .set('Authorization', `Bearer ${token}`)
      .send({ VeiculoId: v2.id, MotoristaId: m2.id, RotaId: rotaId, CargaId: cargaId, ClienteId: clienteId });
    viagemId = res.body.viagem.id;
  });

  it('atualiza status para EM_ANDAMENTO e registra dataPartida', async () => {
    const res = await request(app)
      .patch(`/viagens/${viagemId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'EM_ANDAMENTO' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('EM_ANDAMENTO');
    expect(res.body.dataPartida).toBeTruthy();
  });

  it('atualiza status para CONCLUIDA e registra dataChegada', async () => {
    const res = await request(app)
      .patch(`/viagens/${viagemId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'CONCLUIDA' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CONCLUIDA');
    expect(res.body.dataChegada).toBeTruthy();
  });

  it('retorna 400 para status inválido', async () => {
    const res = await request(app)
      .patch(`/viagens/${viagemId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'INVALIDO' });
    expect(res.status).toBe(400);
  });
});
