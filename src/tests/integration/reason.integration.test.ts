import request from 'supertest';
import app from '../../app';
import { orgId, reasonId, managerToken } from '../setup';

describe('📋 Reason Controller', () => {
  test('GET /api/orgs/:orgId/reasons → list reasons', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/reasons`)
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/orgs/:orgId/reasons/:reasonId/articles → default articles for reason', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/reasons/${reasonId}/articles`)
      .set('Authorization', `Bearer ${managerToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
