import request from 'supertest';
import app from '../../app';
import { managerToken, orgId } from '../setup';

describe('Bug Integration', () => {
  it('lists bugs', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/bugs`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
