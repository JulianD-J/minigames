// Tests para sesión admin por cookie y protección de admin.html.
const request = require('supertest');
const { createApp } = require('../server/server');

describe('admin session and page protection', () => {
  const app = createApp();

  beforeEach(() => {
    process.env.ADMIN_TOKEN = 'test-admin';
  });

  test('bloquea admin.html sin cookie', async () => {
    const res = await request(app).get('/admin.html');
    expect(res.status).toBe(403);
  });

  test('permite admin.html con cookie de sesión', async () => {
    const login = await request(app)
      .post('/api/admin/session')
      .send({ token: 'test-admin' });

    expect(login.status).toBe(200);
    const cookie = login.headers['set-cookie'];
    expect(cookie).toBeDefined();

    const page = await request(app).get('/admin.html').set('Cookie', cookie);
    expect(page.status).toBe(200);
    expect(page.text).toMatch(/Consola Administración/i);
  });
});
