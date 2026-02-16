// Tests API admin: requiere sesión admin auténtica (U00130246 + JulianD).
const request = require('supertest');
const { createApp } = require('../server/server');

describe('admin endpoints', () => {
  const app = createApp();

  test('bloquea players endpoint sin sesión admin', async () => {
    const res = await request(app).get('/api/admin/players');
    expect(res.status).toBe(401);
  });

  test('permite con sesión admin obtenida en /api/login', async () => {
    const login = await request(app)
      .post('/api/login')
      .send({ u00: 'U00130246', alias: 'JulianD' });

    const cookie = login.headers['set-cookie'];
    const res = await request(app)
      .get('/api/admin/players')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('players');
  });
});
