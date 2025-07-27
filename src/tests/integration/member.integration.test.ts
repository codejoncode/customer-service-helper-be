import request from 'supertest';
import app from '../../app';
import { orgId, seededMemberId, managerToken, agentToken } from '../setup';

describe('👥 Member Controller (Integration)', () => {
  let newMemberId = 'M999';

  test('GET /api/orgs/:orgId/members/:memberId → fetch seeded member as AGENT', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/members/${seededMemberId}`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('John Doe');
    expect(res.body.dob).toBe('1980-01-01');
  });

  test('POST /api/orgs/:orgId/members → create new member', async () => {
    const payload = {
      memberId: newMemberId,
      name: 'Test Member',
      dob: '1990-06-15',
      phone: '555-6789',
      streetAddress: '456 Oak St',
      city: 'Smallville',
      state: 'IN',
      zipcode: '46013',
    };

    const res = await request(app)
      .post(`/api/orgs/${orgId}/members`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.memberId).toBe(newMemberId);
    expect(res.body.name).toBe('Test Member');
  });

  test('GET /api/orgs/:orgId/members/:memberId → fetch newly added member', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/members/${newMemberId}`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Member');
  });

  test('POST → 400 on missing required fields', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Incomplete' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/missing fields/i);
  });

  test('GET → 404 on invalid memberId', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/members/does-not-exist`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  test('GET → 401 if not authenticated', async () => {
    const res = await request(app).get(`/api/orgs/${orgId}/members/${seededMemberId}`);
    expect(res.status).toBe(401);
  });
});
