import request from 'supertest';
import app from '../app';
import { agentToken, orgId } from './setup';

describe('🔍 Article Suggester', () => {
  test('400 if neither callReason nor checklistItem', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/articles/suggest`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Either callReason or checklistItem/);
  });

  test('200 with empty suggestions if no tag match', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/articles/suggest`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ callReason: 'no-such-tag' });
    expect(res.status).toBe(200);
    expect(res.body.suggestions).toEqual([]);
  });

  test('200 with suggestion objects when there is a match', async () => {
    // Assumes setup.ts seeded an article with tags ['billing']
    const res = await request(app)
      .post(`/api/orgs/${orgId}/articles/suggest`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ callReason: 'billing' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.suggestions)).toBe(true);
    const first = res.body.suggestions[0];
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('url');
    expect(first).toHaveProperty('summary');
    expect(first).toHaveProperty('inlineSuggestions');
  });
});
