import request from 'supertest';
import app from '../../app';
import { agentToken, orgId } from '../setup';

describe('FAQ Integration', () => {
  it('lists FAQs', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/faqs`)
      .set('Authorization', `Bearer ${agentToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
