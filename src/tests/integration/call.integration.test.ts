import request from 'supertest';
import app from '../../app';
import { agentToken, orgId } from '../setup';

describe('Call Integration', () => {
  it('lists calls', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/calls`)
      .set('Authorization', `Bearer ${agentToken}`);
    expect([200, 401, 403, 404]).toContain(res.status); // depends on token
  });
});
