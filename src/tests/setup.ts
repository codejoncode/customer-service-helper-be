import { prisma } from '../config/db'
import bcrypt from 'bcrypt'
import { generateTestJWT, TestRole } from './utils/generateToken'
import app from '../app'        // ensure this exports Express *without* .listen()
import request from 'supertest'

jest.setTimeout(30000)

export let adminToken: string
export let managerToken: string
export let agentToken: string
export let orgId: string
export let memberId: string
export let reasonId: string
export let articleId: string
export let actionId: string
export let checklistId: string

beforeAll(async () => {
  // clean slate
  await prisma.callLog.deleteMany()
  await prisma.action.deleteMany()
  await prisma.closingItem.deleteMany()
  await prisma.article.deleteMany()
  await prisma.callReason.deleteMany()
  await prisma.member.deleteMany()
  await prisma.agent.deleteMany()
  await prisma.organization.deleteMany()

  // 1) create org
  const org = await prisma.organization.create({
    data: { name: 'Test Org', validationFields: ['name','dob'], plan: 'PAID' }
  })
  orgId = org.id

  // 2) callReason
  const reason = await prisma.callReason.create({
    data: { label: 'Test Reason', orgId }
  })
  reasonId = reason.id

  // 3) article
  const article = await prisma.article.create({
    data: {
      reason: 'Test Reason',
      required: ['Must say this'],
      template: 'Template',
      url: '/test',
      fullArticle: 'Full content',
      orgId
    }
  })
  articleId = article.id

  // 4) action mapping
  const action = await prisma.action.create({
    data: { label: reason.label, defaultArticleId: articleId, orgId }
  })
  actionId = action.id

  // 5) checklist
  const checklist = await prisma.closingItem.create({
    data: { label: 'Thank you – closing', orgId }
  })
  checklistId = checklist.id

  // 6) member
  const member = await prisma.member.create({
    data: {
      memberId: 'm1',
      name: 'John Doe',
      dob: '1980-01-01',
      phone: '555-0001',
      streetAddress: '123 Elm St',
      city: 'Metropolis',
      state: 'IN',
      zipcode: '46012',
      orgId
    }
  })
  memberId = member.id

  // 7) agents
  const hash = await bcrypt.hash('password', 10)
  const [admin, manager, agent] = await Promise.all([
    prisma.agent.create({ data: { name: 'Admin', username: 'admin', passwordHash: hash, role: 'ADMIN', orgId } }),
    prisma.agent.create({ data: { name: 'Manager', username: 'manager', passwordHash: hash, role: 'MANAGER', orgId } }),
    prisma.agent.create({ data: { name: 'Agent', username: 'agent', passwordHash: hash, role: 'AGENT', orgId } })
  ])

  adminToken   = generateTestJWT({ userId: admin.id, orgId, role: 'ADMIN' })
  managerToken = generateTestJWT({ userId: manager.id, orgId, role: 'MANAGER' })
  agentToken   = generateTestJWT({ userId: agent.id, orgId, role: 'AGENT' })
})

afterAll(async () => {
  await prisma.$disconnect()
})