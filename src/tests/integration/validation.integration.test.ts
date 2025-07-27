import request from 'supertest';
import app from '../../app';
import { orgId, seededMemberId, agentToken, managerToken } from '../setup';

describe('🔍 Validation Controller', () => {
  test('POST /…/members/:memberId/validate as AGENT', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/${seededMemberId}/validate`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        name: 'John Doe',
        dob: '1980-01-01',
        phone: '555-0001',
        streetAddress: '',
        zipcode: '',
      });
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  test('403 for MANAGER without header', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/${seededMemberId}/validate`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'John Doe', dob: '1980-01-01' });
    expect(res.status).toBe(403);
  });
});
