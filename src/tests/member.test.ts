import request from 'supertest'
import app from '../app'
import { managerToken, agentToken, orgId } from './setup'

describe('Member Routes', () => {
  test('GET /api/orgs/:orgId/members → 403 AGENT', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/members`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(403)
  })

  test('GET /api/orgs/:orgId/members → 200 MANAGER', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}/members`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('POST /api/orgs/:orgId/members → 201 MANAGER', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/members`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        memberId: 'm2',
        name: 'Jane',
        dob: '1990-02-02',
        phone: '555-0002',
        streetAddress: '456 Oak',
        city: 'Gotham',
        state: 'IN',
        zipcode: '46013',
      })
    expect(res.status).toBe(201)
    expect(res.body.memberId).toBe('m2')
  })
})