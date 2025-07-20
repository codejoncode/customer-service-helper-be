import request from 'supertest';
import app from '../app';
import { managerToken, orgId, callLogId } from './setup';

/**
 * - ✅ Summary creation from seeded call log
 * - ✅ Retrieval by ID
 * - ❌ Rejection when payload is missing
 * - ❌ Rejection when summary doesn’t exist
 */
describe('📞 Call Summary Agent', () => {
  let summaryId: number;

  test('POST /api/orgs/:orgId/call-summaries → generates summary', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/call-summaries`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ callLogId });

    console.log('🧪 POST response:', res.body);

    expect(res.status).toBe(201);
    expect(res.body.summaryText).toMatch(/difficulty logging/i);
    summaryId = res.body.id;
    expect(typeof summaryId).toBe('number');
  });

  test('GET /api/orgs/:orgId/call-summaries/:id → fetch summary', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/call-summaries/${summaryId}`)
      .set('Authorization', `Bearer ${managerToken}`);

    console.log('🧪 GET response:', res.body);

    expect(res.status).toBe(200);
    expect(res.body.callLogId).toBe(callLogId);
    expect(res.body.actionsTaken).toContain('Explained billing page');
  });
});
