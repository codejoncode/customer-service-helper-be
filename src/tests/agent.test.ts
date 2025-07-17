import request from 'supertest'
import app from '../app'
import { adminToken, managerToken, agentToken, orgId } from './setup'

describe('Agent Routes', () => {
  let newAgentId: string

  test('GET /api/orgs/:orgId/agents → 200 MANAGER', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/agents`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('POST /api/orgs/:orgId/agents → 201 MANAGER', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/agents`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'New A', username: 'na', password: 'p', role: 'AGENT' })
    expect(res.status).toBe(201)
    newAgentId = res.body.id
  })

  test('PUT /api/orgs/:orgId/agents/:agentId → 200 MANAGER', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}/agents/${newAgentId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Edited A', role: 'MANAGER' })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Edited A')
  })

  test('DELETE /api/orgs/:orgId/agents/:agentId → 200 ADMIN', async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}/agents/${newAgentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})