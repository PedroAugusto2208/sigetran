const request = require('supertest');
const app = require('../src/app');

require('./setup');

describe('POST /auth/login', () => {
  it('retorna token com credenciais válidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ login: 'admin', senha: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.tipo).toBe('ADMINISTRADOR');
  });

  it('retorna 401 com senha errada', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ login: 'admin', senha: 'errada' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('erro');
  });

  it('retorna 400 sem body', async () => {
    const res = await request(app).post('/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('retorna 401 com usuário inexistente', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ login: 'naoexiste', senha: '123' });
    expect(res.status).toBe(401);
  });
});
