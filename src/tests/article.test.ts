import request from 'supertest'
import { managerToken, agentToken, orgId, articleId } from './setup'

import app from "../app";

describe('📚 Article Routes', () => {
  let newArticleId: string

  test('GET /api/orgs/:orgId/articles → 200 list articles', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/articles`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('GET /api/orgs/:orgId/articles/:id → 200 get one', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/articles/${articleId}`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(articleId)
  })

  test('POST /api/orgs/:orgId/articles → 401 no token', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/articles`)
      .send({ reason: 'x', required: ['a'], template: 't', url: '/u', fullArticle: 'f' })
    expect(res.status).toBe(401)
  })

  test('POST /api/orgs/:orgId/articles → 403 as AGENT', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/articles`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ reason: 'x', required: ['a'], template: 't', url: '/u', fullArticle: 'f' })
    expect(res.status).toBe(403)
  })

  test('POST /api/orgs/:orgId/articles → 201 create', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/articles`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        reason: 'New Reason',
        required: ['must'],
        template: 'tpl',
        url: '/kb/new',
        fullArticle: 'body',
      })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    newArticleId = res.body.id
  })

  test('PUT /api/orgs/:orgId/articles/:id → 200 update', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/articles/${newArticleId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ template: 'updated tpl' })
    expect(res.status).toBe(200)
    expect(res.body.template).toBe('updated tpl')
  })

  test('DELETE /api/orgs/:orgId/articles/:id → 200 delete', async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/articles/${newArticleId}`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(200)
  })
})