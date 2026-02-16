// Tests para acceso admin únicamente con login especial U00+alias.
const request = require('supertest');
const { createApp } = require('../server/server');

describe('admin session and page protection', () => {
  const app = createApp();

  test('bloquea admin.html sin cookie admin', async () => {
    const res = await request(app).get('/admin.html');
    expect(res.status).toBe(403);
  });

  test('permite admin.html solo con credenciales admin exactas', async () => {
    const login = await request(app)
      .post('/api/login')
      .send({ u00: 'U00130246', alias: 'JulianD' });

    expect(login.status).toBe(200);
    expect(login.body.profile.isAdmin).toBe(true);

    const cookie = login.headers['set-cookie'];
    const page = await request(app).get('/admin.html').set('Cookie', cookie);
    expect(page.status).toBe(200);
    expect(page.text).toMatch(/Consola Administración/i);
  });
});
