import request from 'supertest';
import { prisma } from '../config/db';
import app from '../app';

describe('🔒 Authentication', () => {
  afterAll(async () => {
    await prisma.agent.deleteMany({ where: { username: 'newuser' } });
    await prisma.organization.deleteMany({ where: { name: 'New Org' } });
  });

  test.skip('POST /api/auth/register → 400 missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register') // ✅ Don't send Authorization
      .send({ username: 'only' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/missing/i);
  });

  test.skip('POST /api/auth/register → 200 success', async () => {
    const res = await request(app).post('/api/auth/register').send({
      orgName: 'New Org',
      adminName: 'New Admin',
      username: 'newuser',
      password: 'pass1234',
      email: 'newadmin@example.com',
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
