// Tests API admin: protección de token y lectura de endpoints.
const request = require('supertest');
const { createApp } = require('../server/server');

describe('admin endpoints', () => {
  const app = createApp();

  test('requiere token admin', async () => {
    const res = await request(app).get('/api/admin/players');
    expect(res.status).toBe(401);
  });

  test('permite con token válido', async () => {
    process.env.ADMIN_TOKEN = 'test-admin';
    const res = await request(app)
      .get('/api/admin/players')
      .set('x-admin-token', 'test-admin');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('players');
  });
});
