import request from 'supertest';
import app from '../../app';
import { orgId, callLogId, agentToken } from '../setup';

describe('📝 Call Summary Controller', () => {
  let summaryId: number;

  test('POST /api/orgs/:orgId/summary → generate summary from callLog', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/summary`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ callLogId });

    expect(res.status).toBe(201);
    expect(res.body.callLogId).toBe(callLogId);
    summaryId = res.body.id;
  });

  test('GET /api/orgs/:orgId/summary/:id → get by ID', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/summary/${summaryId}`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(summaryId);
  });
});
