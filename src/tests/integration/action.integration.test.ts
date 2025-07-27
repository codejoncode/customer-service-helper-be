// src/tests/integration/action.integration.test.ts
import request from 'supertest';
import app from '../../app';
import { orgId, actionId, reasonId, articleId, managerToken, agentToken } from '../setup';

describe('🔀 Action Controller (Mappings)', () => {
  test('GET  /api/orgs/:orgId/actions', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/actions`)
      .set('Authorization', `Bearer ${agentToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET  /api/orgs/:orgId/actions/:id', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/actions/${actionId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.callReasonId).toBe(reasonId);
    expect(res.body.defaultArticleId).toBe(articleId);
  });

  test('POST /api/orgs/:orgId/actions → upsert mapping', async () => {
    const payload = { reasonId, articleId };
    const res = await request(app)
      .post(`/api/orgs/${orgId}/actions`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send(payload);
    expect(res.status).toBe(200);
    expect(res.body.callReasonId).toBe(reasonId);
    expect(res.body.defaultArticleId).toBe(articleId);
  });

  test('PUT  /api/orgs/:orgId/actions/:id', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/actions/${actionId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ label: 'Updated Label' });
    expect(res.status).toBe(200);
    expect(res.body.label).toBe('Updated Label');
  });

  test('DELETE /api/orgs/:orgId/actions/:id', async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/actions/${actionId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });
});
