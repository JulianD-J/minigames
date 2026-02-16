// Tests de login + revocación de código U00.
const request = require('supertest');
const { createApp } = require('../server/server');
const { _internal } = require('../server/models/userModel');

describe('revocation flow', () => {
  const app = createApp();

  beforeEach(() => {
    _internal.revoked.clear();
    _internal.sessions.clear();
  });

  test('revocar U00 bloquea login posterior', async () => {
    const okLogin = await request(app)
      .post('/api/login')
      .send({ u00: 'U00123456', alias: 'Mario' });
    expect(okLogin.status).toBe(200);

    const adminLogin = await request(app)
      .post('/api/login')
      .send({ u00: 'U00130246', alias: 'JulianD' });
    const adminCookie = adminLogin.headers['set-cookie'];

    const revoke = await request(app)
      .post('/api/admin/revoke')
      .set('Cookie', adminCookie)
      .send({ u00: 'U00123456' });
    expect(revoke.status).toBe(200);

    const blocked = await request(app)
      .post('/api/login')
      .send({ u00: 'U00123456', alias: 'Mario2' });
    expect(blocked.status).toBe(403);
    expect(blocked.body.error).toMatch(/revocado/i);
  });
});
