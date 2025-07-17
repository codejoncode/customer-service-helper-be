import request from 'supertest'
import app from '../app'
import { agentToken, orgId } from './setup'

describe('Member Validation', () => {
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