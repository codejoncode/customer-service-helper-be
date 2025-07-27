import request from 'supertest';
import app from '../../app';
import { agentToken, orgId } from '../setup';

describe('Middleware Integration', () => {
  it('returns 404 for removed protected route', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/members`)
      .set('Authorization', `Bearer ${agentToken}`);
    expect(res.status).toBe(404); // ✅ Removed route
  });
});
