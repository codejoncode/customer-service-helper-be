import request from 'supertest';
import app from '../app';
import {
  orgId,
  agentToken,
  managerToken,
  seededMemberId, // external ID again
} from './setup';

describe('🔍 Member Field Validation', () => {
  test('POST /…/members/:memberId/validate → 200 when ≥2 fields match', async () => {
    const payload = {
      name: 'John Doe',
      dob: '1980-01-01',
      phone: '555-0001',
      streetAddress: 'Wrong Address',
      zipcode: '46012',
    };

    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/${seededMemberId}/validate`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.matchedFields).toEqual(
      expect.arrayContaining(['name', 'dob', 'phone', 'zipcode']),
    );
    expect(res.body.failedFields).toContain('streetAddress');
  });

  test('POST /…/members/:memberId/validate → 200 when <2 fields match', async () => {
    const payload = {
      name: 'Wrong Name',
      dob: 'wrong dob',
      phone: '',
      streetAddress: '',
      zipcode: 'wrong zip',
    };

    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/${seededMemberId}/validate`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
    expect(res.body.failedFields.length).toBeGreaterThanOrEqual(4);
  });

  test('POST /…/members/:memberId/validate → 403 for MANAGER without training flag', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/${seededMemberId}/validate`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'John Doe', dob: '1980-01-01' });

    expect(res.status).toBe(403);
  });

  test('POST /…/members/:memberId/validate → 404 on bad memberId', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/fake-id/validate`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ name: 'John Doe', dob: '1980-01-01' });

    expect(res.status).toBe(404);
  });
});
