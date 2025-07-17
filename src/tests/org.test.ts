import request from 'supertest'
import app from '../app'
import { adminToken, managerToken, agentToken, orgId } from './setup'

describe('Organization Routes', () => {
  test('GET /api/orgs → 401 no token', async () => {
    const res = await request(app).get('/api/orgs')
    expect(res.status).toBe(401)
  })

  test('GET /api/orgs → 403 AGENT', async () => {
    const res = await request(app)
      .get('/api/orgs')
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(403)
  })

  test('GET /api/orgs → 200 ADMIN', async () => {
    const res = await request(app)
      .get('/api/orgs')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('POST /api/orgs → 403 MANAGER', async () => {
    const res = await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'X' })
    expect(res.status).toBe(403)
  })

  test('POST /api/orgs → 201 ADMIN', async () => {
    const res = await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Another Org' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
  })

  test('GET /api/orgs/:id → 200 valid', async () => {
    const res = await request(app)
      .get(`/api/orgs/${orgId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(orgId)
  })

  test('GET /api/orgs/invalid → 404', async () => {
    const res = await request(app)
      .get('/api/orgs/invalid')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(404)
  })

  test('PUT /api/orgs/:id → 200 MANAGER', async () => {
    const res = await request(app)
      .put(`/api/orgs/${orgId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Updated Org' })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Updated Org')
  })

  test('DELETE /api/orgs/:id → 403 MANAGER', async () => {
    const res = await request(app)
      .delete(`/api/orgs/${orgId}`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(403)
  })

  test('DELETE /api/orgs/:id → 200 ADMIN', async () => {
    // create a throw-away org
    const throwaway = await request(app)
      .post('/api/orgs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'ToDelete' })
    const id = throwaway.body.id

    const res = await request(app)
      .delete(`/api/orgs/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  test('POST /api/orgs/:id/upgrade → 200 ADMIN', async () => {
    const res = await request(app)
      .post(`/api/orgs/${orgId}/upgrade`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.plan).toBe('PAID')
  })
})