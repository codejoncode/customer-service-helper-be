import request from 'supertest';
import app from '../app';
import { agentToken, orgId } from './setup';

describe('Checklist Tests', () => {
  it('lists checklists', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/checklist`)
      .set('Authorization', `Bearer ${agentToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
