import request from 'supertest';
import app from '../../app';
import { orgId, agentToken } from '../setup';

describe('📚 Training Controller', () => {
  let trainingId: number;

  test('POST /api/orgs/:orgId/training → run training session', async () => {
    const payload = {
      prompts: { checklist: 'Did you verify account status?' },
      responses: { reply: 'Yes, confirmed.' },
    };

    const res = await request(app)
      .post(`/api/orgs/${orgId}/training`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    trainingId = res.body.id;
    expect(res.body.training).toBe(true);
  });

  test('GET /api/orgs/:orgId/training → list training logs', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/training`)
      .set('Authorization', `Bearer ${agentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.some((log: any) => log.id === trainingId)).toBe(true);
  });
});
