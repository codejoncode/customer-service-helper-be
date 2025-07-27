import request from 'supertest';
import app from '../app';
import { managerToken, agentToken, orgId, callLogId, memberId } from './setup';

describe('🆘 Escalation Router', () => {
  test('Agent can create an escalation', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/escalations`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        callLogId,
        memberId,
        reason: 'Needs manager follow-up',
        auditLog: { step: 'agent clicked escalate' },
      });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('pending');
  });

  test('Manager can view escalations', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/escalations`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].orgId).toBe(orgId);
  });

  test('Fails without callLogId', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/escalations`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ memberId });
    expect(res.status).toBe(400);
  });
});
