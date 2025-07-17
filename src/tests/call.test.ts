import request from 'supertest'
import app from '../app'
import { agentToken, orgId, memberId, reasonId, articleId } from './setup'
import jwt from 'jsonwebtoken'

describe('Call Session Logging & Note Generation', () => {
  let createdCallId: string
  let agentUserId: string

  beforeAll(() => {
    // decode agentToken to pull out the userId for payload
    const payload = jwt.decode(agentToken) as { userId: string }
    agentUserId = payload.userId
  })

  test('POST /api/orgs/:orgId/calls → 401 if no token', async () => {
    const res = await request(app).post(`/api/orgs/${orgId}/calls`)
    expect(res.status).toBe(401)
  })

  test('POST /api/orgs/:orgId/calls → 400 missing fields', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/calls`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({})
    expect(res.status).toBe(400)
  })

  test('POST /api/orgs/:orgId/calls → 201 success', async () => {
    const payload = {
      memberId,
      agentId: agentUserId,
      reasonId,
      articleId,
      actionsTaken: ['action1', 'action2'],
      closingChecklist: ['prompt1', 'prompt2'],
      notes: 'All done'
    }
    const res = await request(app)
      .post(`/api/orgs/${orgId}/calls`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send(payload)
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    createdCallId = res.body.id
  })

  test('POST /api/orgs/:orgId/calls/generate-notes → 200 formatted notes', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/calls/generate-notes`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        memberId,
        reason: 'Test Reason',
        articleTitle: 'Test Reason',
        actionsTaken: ['action1'],
        closingChecklist: ['prompt1']
      })
    expect(res.status).toBe(200)
    expect(typeof res.body.notes).toBe('string')
    expect(res.body.notes).toContain(`Member: ${memberId}`)
  })
})