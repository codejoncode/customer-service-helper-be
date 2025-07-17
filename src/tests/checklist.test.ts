import request from 'supertest'
import app from '../app'
import { managerToken, agentToken, orgId, checklistId } from './setup'

describe('Checklist Routes', () => {
  let newChecklistId: string

  test('GET /api/orgs/:orgId/checklists → 401 if no token', async () => {
    const res = await request(app).get(`/api/orgs/${orgId}/checklists`)
    expect(res.status).toBe(401)
  })

  test('GET /api/orgs/:orgId/checklists → 403 as AGENT', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/checklists`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(403)
  })

  test('GET /api/orgs/:orgId/checklists → 200 as MANAGER', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/checklists`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body[0].id).toBe(checklistId)
  })

  test('GET /api/orgs/:orgId/checklists/:id → 200 valid ID', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/checklists/${checklistId}`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(checklistId)
  })

  test('GET /api/orgs/:orgId/checklists/invalid → 404 invalid ID', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/checklists/invalid`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(404)
  })

  test('POST /api/orgs/:orgId/checklists → 201 create', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/checklists`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ label: 'New Prompt' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.label).toBe('New Prompt')
    newChecklistId = res.body.id
  })

  test('PUT /api/orgs/:orgId/checklists/:id → 200 update', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/checklists/${newChecklistId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ label: 'Updated Prompt' })
    expect(res.status).toBe(200)
    expect(res.body.label).toBe('Updated Prompt')
  })

  test('DELETE /api/orgs/:orgId/checklists/:id → 200 delete', async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/checklists/${newChecklistId}`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(200)
  })
})