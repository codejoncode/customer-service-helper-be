import request from 'supertest'
import { agentToken, orgId, reasonId, articleId } from './setup'

import app from "../app";

describe('📋 Reason & Article Lookup', () => {
  test('GET /api/orgs/:orgId/reasons → 200 list reasons', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/reasons`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)
    expect(res.body.some((r: any) => r.id === reasonId)).toBe(true)
  })

  test('GET /api/orgs/:orgId/reasons/:reasonId/articles → 200 list articles', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/reasons/${reasonId}/articles`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)
    expect(res.body.some((a: any) => a.id === articleId)).toBe(true)
  })
})