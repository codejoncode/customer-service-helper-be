import request from 'supertest';
import app from '../../app';
import { orgId, adminToken } from '../setup';

describe('🏢 Organization Controller', () => {
  test('GET /api/orgs → list all orgs', async () => {
    const res = await request(app).get('/api/orgs').set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/orgs/:orgId → get org details', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(orgId);
    expect(res.body.agents).toBeDefined();
  });

  test('POST /api/orgs → create new org', async () => {
    const res = await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Integration Test Org' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Integration Test Org');
  });

  test('PUT /api/orgs/:orgId → update org name', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Org Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Org Name');
  });

  test('POST /api/orgs/:orgId/upgrade → upgrade org plan', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/upgrade`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.plan).toBe('PAID');
  });
});
