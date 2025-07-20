import request from 'supertest';
import app from '../app';
import { agentToken, orgId, memberId } from './setup';

describe('🔍 Member Field Validation', () => {
  test('POST /api/orgs/:orgId/members/:memberId/validate → passes with 2+ matches', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/${memberId}/validate`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        name: 'John Doe',
        dob: '1980-01-01',
        phone: '555-0001',
        streetAddress: 'wrong address',
        zipcode: '46012',
      });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.matchedFields).toEqual(
      expect.arrayContaining(['name', 'dob', 'phone', 'zipcode']),
    );
    expect(res.body.failedFields).toContain('streetAddress');
  });

  test('POST → fails with fewer than 2 matches', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/${memberId}/validate`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        name: 'Wrong Name',
        dob: 'wrong dob',
        phone: '',
        streetAddress: '',
        zipcode: 'wrong zip',
      });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.failedFields.length).toBeGreaterThanOrEqual(4);
  });
});
