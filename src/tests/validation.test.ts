import request from 'supertest'
import app from '../app'
import { managerToken, agentToken, orgId } from './setup'

describe('Validation Rules Routes', () => {
  test('GET /api/orgs/:orgId/validation-rules → 401 if no token', async () => {
    const res = await request(app).get(`/api/orgs/${orgId}/validation-rules`)
    expect(res.status).toBe(401)
  })

  test('GET /api/orgs/:orgId/validation-rules → 403 as AGENT', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/validation-rules`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(403)
  })

  test('GET /api/orgs/:orgId/validation-rules → 200 as MANAGER', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/validation-rules`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.validationFields)).toBe(true)
  })

  test('GET /api/orgs/invalid/validation-rules → 404 invalid org', async () => {
    const res = await request(app)
      .get('/api/orgs/invalid/validation-rules')
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(404)
  })
})