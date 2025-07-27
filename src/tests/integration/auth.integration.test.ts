import request from 'supertest';
import app from '../../app';

describe('Auth Integration', () => {
  it.skip('returns 400 when registering with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });

  it.skip('returns 400 when logging in with missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });
});
