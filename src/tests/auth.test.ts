import request from "supertest";

import app from '../app' // your Express app entry point
import { generateTestJWT } from './utils/generateToken'
import test, { describe } from 'node:test'

let adminToken: string
let userToken: string
let agentToken: string

beforeAll(() => {
  adminToken = generateTestJWT({ userId: 'admin-user-1', role: 'ADMIN', orgId: 'org-001' })
  userToken = generateTestJWT({ userId: 'user-1', role: 'USER', orgId: 'org-002' })
  agentToken = generateTestJWT({ userId: 'agent-1', role: 'AGENT', orgId: 'org-003' })
})

describe('🔒 Authentication & RBAC Tests', () => {
  test('GET /api/members - no token → 401', async () => {
    const res = await request(app).get('/api/members')
    expect(res.status).toBe(401)
    expect(res.body.message).toMatch(/unauthorized|token/i)
  })

  test('GET /api/members - as user → 403', async () => {
    const res = await request(app)
      .get('/api/members')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(403)
    expect(res.body.message).toMatch(/access denied|forbidden/i)
  })

  test('GET /api/members - as admin → 200 and array', async () => {
    const res = await request(app)
      .get('/api/members')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('POST /api/articles - as agent → 403', async () => {
    const newArticle = {
      reason: 'Test Reason',
      required: ['Say this', 'Verify that'],
      template: 'Template content...',
      url: '/articles/test',
      fullArticle: 'Full article content...'
    }

    const res = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${agentToken}`)
      .send(newArticle)

    expect(res.status).toBe(403)
  })
})