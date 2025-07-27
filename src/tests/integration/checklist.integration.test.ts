import request from 'supertest';
import app from '../../app';
import { orgId, managerToken, checklistId } from '../setup';

describe('✅ Checklist Controller', () => {
  let newId: string;

  test('GET /api/orgs/:orgId/checklist → fetch all', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/checklist`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
  });

  test('GET /api/orgs/:orgId/checklist/:id → fetch one', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/checklist/${checklistId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.label).toBeDefined();
  });

  test('POST /api/orgs/:orgId/checklist → create item', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/checklist`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ label: 'Confirm payment success' });
    expect(res.status).toBe(201);
    newId = res.body.id;
  });

  test('PUT /api/orgs/:orgId/checklist/:id → update item', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/checklist/${newId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ label: 'Updated checklist label' });
    expect(res.status).toBe(200);
    expect(res.body.label).toMatch(/updated/i);
  });

  test('DELETE /api/orgs/:orgId/checklist/:id → remove', async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/checklist/${newId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
  });
});
