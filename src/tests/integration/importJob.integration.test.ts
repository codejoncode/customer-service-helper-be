import request from 'supertest';
import app from '../../app';
import { agentToken, orgId } from '../setup';

// there is no get route and we need to test out the patch we never need to get them.
describe('Import Job Integration', () => {
  it.skip('lists import jobs', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/import-jobs`)
      .set('Authorization', `Bearer ${agentToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
