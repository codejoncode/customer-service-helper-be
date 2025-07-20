import request from 'supertest';
import { adminToken, managerToken, agentToken, orgId } from './setup';
import app from '../app';

describe('💬 FAQ Agent Routes', () => {
  let faqId: number;

  const payload = {
    question: 'How do I submit a ticket?',
    answer: 'Visit the support tab and click "Submit a ticket".',
    tags: ['support', 'ticket'],
  };

  test('POST /api/orgs/:orgId/faqs → 403 as AGENT', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/faqs`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send(payload);
    expect(res.status).toBe(403);
  });

  test('POST /api/orgs/:orgId/faqs → 201 create as MANAGER', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/faqs`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.question).toContain('submit a ticket');
    faqId = res.body.id;
  });

  test('POST /api/orgs/:orgId/faqs → 201 create as ADMIN', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/faqs`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        question: 'Can I escalate this?',
        answer: 'Use the escalation form in the CRM sidebar.',
        tags: ['support', 'escalation'],
      });
    expect(res.status).toBe(201);
    expect(res.body.tags).toContain('escalation');
  });

  test('GET /api/orgs/:orgId/faqs → 200 list FAQs', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/faqs`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/orgs/:orgId/faqs/search?q=ticket → 200 match FAQ', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/faqs/search?q=ticket`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.faqs.some((f: any) => f.question.includes('ticket'))).toBe(true);
  });

  test('GET /api/orgs/:orgId/faqs/tags → 200 tag list', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/faqs/tags`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.tags.includes('support')).toBe(true);
  });

  test('GET /api/orgs/:orgId/faqs/:id → 200 fetch FAQ by ID', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/faqs/${faqId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(faqId);
  });
});
