import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { generateTestJWT, TestRole, TestUserPayload } from './utils/generateToken';

jest.setTimeout(30000);

export let adminToken: string;
export let managerToken: string;
export let agentToken: string;
export let orgId: string;
export let reasonId: string;
export let articleId: string;
export let actionId: string;
export let checklistId: string;
export let memberId: string;

beforeAll(async () => {
  // 0) Clean slate
  await prisma.callLog.deleteMany();
  await prisma.action.deleteMany();
  await prisma.closingItem.deleteMany();
  await prisma.article.deleteMany();
  await prisma.callReason.deleteMany();
  await prisma.member.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.organization.deleteMany();

  // 1) Create an org
  const org = await prisma.organization.create({
    data: {
      name: 'Test Org',
      plan: 'PAID',
      validationFields: ['name', 'dob'],
    },
  });
  orgId = org.id;

  // 2) Create a call reason
  const reason = await prisma.callReason.create({
    data: { label: 'Test Reason', orgId },
  });
  reasonId = reason.id;

  // 3) Create an article
  const article = await prisma.article.create({
    data: {
      reason: 'Test Reason',
      required: ['Please verify this'],
      template: 'Hello, ...',
      url: '/kb/test',
      fullArticle: 'Full article body',
      orgId,
    },
  });
  articleId = article.id;

  // 4) Map reason → article
  const action = await prisma.action.create({
    data: {
      label: reason.label,
      defaultArticleId: articleId,
      callReasonId: reasonId,
      orgId,
    },
  });
  actionId = action.id;

  // 5) Create a closing item
  const checklist = await prisma.closingItem.create({
    data: { label: 'Thank you for calling', orgId },
  });
  checklistId = checklist.id;

  // 6) Create a member
  const member = await prisma.member.create({
    data: {
      memberId: 'M123',
      name: 'John Doe',
      dob: '1980-01-01',
      phone: '555-0001',
      streetAddress: '123 Elm St',
      city: 'Metropolis',
      state: 'IN',
      zipcode: '46012',
      orgId,
    },
  });
  memberId = member.id;

  // 7) Create agents
  const hash = await bcrypt.hash('P@ssw0rd', 10);

  // Helper inside beforeAll so it can see `hash` and `orgId`
  async function createAgent(overrides: Partial<Prisma.AgentCreateInput>, role: TestRole) {
    const base: Prisma.AgentCreateInput = {
      name: role,
      email: `${role.toLowerCase()}@example.com`,
      username: overrides.username ?? role.toLowerCase(),
      passwordHash: hash,
      role,
      organization: {
        connect: { id: orgId },
      },
    };
    return prisma.agent.create({ data: { ...base, ...overrides } });
  }

  const [admin, manager, agent] = await Promise.all([
    createAgent({ username: 'admin' }, 'ADMIN'),
    createAgent({ username: 'manager' }, 'MANAGER'),
    createAgent({ username: 'agent' }, 'AGENT'),
  ]);

  // 8) Generate JWTs
  function makeToken(u: typeof admin, role: TestRole) {
    const payload: TestUserPayload = {
      userId: u.id,
      orgId: u.orgId!,
      role,
    };
    return generateTestJWT(payload);
  }

  adminToken = makeToken(admin, 'ADMIN');
  managerToken = makeToken(manager, 'MANAGER');
  agentToken = makeToken(agent, 'AGENT');
});

afterAll(async () => {
  await prisma.$disconnect();
});
