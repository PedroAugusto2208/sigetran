const request = require('supertest');
const app = require('../src/app');

require('./setup');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ login: 'admin', senha: 'admin123' });
  token = res.body.token;
});

describe('GET /veiculos', () => {
  it('retorna lista vazia inicialmente', async () => {
    const res = await request(app)
      .get('/veiculos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('retorna 401 sem token', async () => {
    const res = await request(app).get('/veiculos');
    expect(res.status).toBe(401);
  });
});

describe('POST /veiculos', () => {
  it('cria veículo com dados válidos', async () => {
    const res = await request(app)
      .post('/veiculos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        placa: 'ABC1234',
        modelo: 'Actros',
        marca: 'Mercedes',
        anoFabricacao: 2020,
        capacidadeCarga: 15000,
      });
    expect(res.status).toBe(201);
    expect(res.body.placa).toBe('ABC1234');
    expect(res.body.id).toBeDefined();
  });

  it('retorna 409 com placa duplicada', async () => {
    const res = await request(app)
      .post('/veiculos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        placa: 'ABC1234',
        modelo: 'Outro',
        marca: 'Volvo',
        anoFabricacao: 2019,
        capacidadeCarga: 10000,
      });
    expect(res.status).toBe(409);
  });
});

describe('PUT /veiculos/:id', () => {
  it('atualiza veículo existente', async () => {
    const criado = await request(app)
      .post('/veiculos')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: 'UPD1111', modelo: 'FH', marca: 'Volvo', anoFabricacao: 2021, capacidadeCarga: 20000 });

    const res = await request(app)
      .put(`/veiculos/${criado.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ modelo: 'FH Updated' });

    expect(res.status).toBe(200);
    expect(res.body.modelo).toBe('FH Updated');
  });

  it('retorna 404 para id inexistente', async () => {
    const res = await request(app)
      .put('/veiculos/99999')
      .set('Authorization', `Bearer ${token}`)
      .send({ modelo: 'X' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /veiculos/:id', () => {
  it('remove veículo existente', async () => {
    const criado = await request(app)
      .post('/veiculos')
      .set('Authorization', `Bearer ${token}`)
      .send({ placa: 'DEL9999', modelo: 'Del', marca: 'DAF', anoFabricacao: 2018, capacidadeCarga: 8000 });

    const res = await request(app)
      .delete(`/veiculos/${criado.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
