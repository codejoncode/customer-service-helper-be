import request from 'supertest';
import app from '../app';
import { agentToken, orgId } from './setup';

describe('Member Tests', () => {
  it('returns 404 for member list route', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/members`)
      .set('Authorization', `Bearer ${agentToken}`);
    expect(res.status).toBe(404); // ✅ Route no longer exists
  });
});
