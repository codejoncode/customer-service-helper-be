import request from 'supertest';
import app from '../../app';
import { orgId, articleId, managerToken } from '../setup';

let newArticleId: string;

describe('📄 Article Controller', () => {
  test('GET  /api/orgs/:orgId/articles', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/articles`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET  /api/orgs/:orgId/articles/:id', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/articles/${articleId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(articleId);
  });

  test('POST /api/orgs/:orgId/articles', async () => {
    const payload = {
      reason: 'New Reason',
      required: ['foo'],
      template: 'bar',
      url: '/new',
      fullArticle: 'content',
      tags: ['foo'],
      summary: 'sum',
    };
    const res = await request(app)
      .post(`/api/orgs/${orgId}/articles`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.url).toBe('/new');
    newArticleId = res.body.id;
  });

  test('PUT  /api/orgs/:orgId/articles/:id', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/articles/${newArticleId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ summary: 'updated' });
    expect(res.status).toBe(200);
    expect(res.body.summary).toBe('updated');
  });

  test('POST /api/orgs/:orgId/articles/suggest', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/articles/suggest`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ callReason: 'Test Reason' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.suggestions)).toBe(true);
  });

  test('DELETE /api/orgs/:orgId/articles/:id', async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/articles/${newArticleId}`)
      .set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
  });
});
