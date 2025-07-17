import request from 'supertest'
import app from '../app'
import { agentToken, orgId, reasonId, articleId } from './setup'

describe('Reason & Article Lookup', () => {
  test('GET /api/orgs/:orgId/reasons → 200 AGENT', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/reasons`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)
    expect(res.body[0].id).toBe(reasonId)
  })

  test('GET /api/orgs/:orgId/reasons/:reasonId/articles → 200 AGENT', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/reasons/${reasonId}/articles`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)
    expect(res.body[0].id).toBe(articleId)
  })
})