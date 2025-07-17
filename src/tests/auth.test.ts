import request from 'supertest'
import app from '../app'
import { prisma } from '../config/db'

describe('Authentication', () => {
  afterAll(async () => {
    // cleanup newly created org & admin
    await prisma.agent.deleteMany({ where: { username: 'newuser' } })
    await prisma.organization.deleteMany({ where: { name: 'New Org' } })
  })

  test('POST /api/auth/register → 400 missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'u' })
    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/missing/i)
  })

  test('POST /api/auth/register → 200 success', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        orgName: 'New Org',
        adminName: 'New Admin',
        username: 'newuser',
        password: 'pass1234'
      })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  test('POST /api/auth/login → 401 invalid creds', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'noone', password: 'x' })
    expect(res.status).toBe(401)
  })

  test('POST /api/auth/login → 200 success', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'newuser', password: 'pass1234' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })
})