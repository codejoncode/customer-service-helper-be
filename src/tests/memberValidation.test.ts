import request from 'supertest'
import { agentToken, managerToken, orgId } from './setup'

import app from "../app";

describe('🔎 Member Validation', () => {
  test('POST /api/orgs/:orgId/members/validate → 401 no token', async () => {
    const res = await request(app).post(`/api/orgs/${orgId}/members/validate`).send({})
    expect(res.status).toBe(401)
  })

  test('POST /api/orgs/:orgId/members/validate → 403 as MANAGER', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/validate`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({})
    expect(res.status).toBe(403)
  })

  test('POST /api/orgs/:orgId/members/validate → 200 valid:false', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/validate`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({})
    expect(res.status).toBe(200)
    expect(res.body.valid).toBe(false)
  })

  test('POST /api/orgs/:orgId/members/validate → 200 valid:true', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members/validate`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ name: 'John Doe', dob: '1980-01-01' })
    expect(res.status).toBe(200)
    expect(res.body.valid).toBe(true)
  })
})