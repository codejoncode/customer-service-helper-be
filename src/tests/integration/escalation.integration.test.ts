import request from 'supertest';
import app from '../../app';
import { orgId, callLogId, memberId, agentToken } from '../setup';

describe('📣 Escalation Controller', () => {
  test('POST /api/orgs/:orgId/escalations → create escalation', async () => {
    const payload = {
      callLogId,
      memberId,
      reason: 'Test escalation request',
      auditLog: { action: 'escalate', detail: 'manual click' },
    };
    const res = await request(app)
      .post(`/api/orgs/${orgId}/escalations`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.reason).toMatch(/test escalation/i);
  });

  test('GET /api/orgs/:orgId/escalations → list items', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/escalations`)
      .set('Authorization', `Bearer ${agentToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
