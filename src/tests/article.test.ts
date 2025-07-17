import request from 'supertest'
import app from '../app'
import { managerToken, agentToken, orgId, articleId } from './setup'

describe('Article Routes', () => {
  let newArticleId: string

  test('GET /api/orgs/:orgId/articles → 200 AGENT', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/articles`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('GET /api/orgs/:orgId/articles/:id → 200 AGENT', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/articles/${articleId}`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(articleId)
  })

  test('POST /api/orgs/:orgId/articles → 201 MANAGER', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/articles`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        reason: 'New R',
        required: ['x'],
        template: 't',
        url: '/u',
        fullArticle: 'f',
      })
    expect(res.status).toBe(201)
    newArticleId = res.body.id
  })

  test('PUT /api/orgs/:orgId/articles/:id → 200 MANAGER', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/articles/${newArticleId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ template: 'updated' })
    expect(res.status).toBe(200)
    expect(res.body.template).toBe('updated')
  })

  test('DELETE /api/orgs/:orgId/articles/:id → 200 MANAGER', async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/articles/${newArticleId}`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(200)
  })
})