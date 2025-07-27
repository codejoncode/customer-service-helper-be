import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateTestJWT, TestRole, TestUserPayload } from './utils/generateToken';
import { normalizeCountry } from '../utils/normalizeCountry';
import type {
  OrganizationCreateInput,
  CallReasonCreateInput,
  ArticleCreateInput,
  ActionCreateInput,
  ClosingItemCreateInput,
  MemberCreateInput,
  AgentCreateInput,
  CallLogCreateInput,
  EscalationCreateInput,
  TrainingLogCreateInput,
  BugReportCreateInput,
} from '../types/prismaInput';

jest.setTimeout(30000);

export const seededMemberId = 'M123';

export let adminToken: string;
export let managerToken: string;
export let agentToken: string;
export let orgId: string;
export let reasonId: string;
export let articleId: string;
export let actionId: string;
export let checklistId: string;
export let memberId: string;
export let callLogId: string;
export let managerUserId: string;

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$transaction([
    prisma.importJob.deleteMany(),
    prisma.escalation.deleteMany(),
    prisma.trainingLog.deleteMany(),
    prisma.bugReport.deleteMany(),
    prisma.callSummary.deleteMany(),
    prisma.callLog.deleteMany(),
    prisma.action.deleteMany(),
    prisma.closingItem.deleteMany(),
    prisma.article.deleteMany(),
    prisma.callReason.deleteMany(),
    prisma.member.deleteMany(),
    prisma.agent.deleteMany(),
    prisma.organization.deleteMany(),
  ]);

  // 1) Create organization
  const orgData: OrganizationCreateInput = {
    name: 'Test Org',
    plan: 'PAID',
    validationFields: ['name', 'dob'],
  };
  const org = await prisma.organization.create({ data: orgData });
  orgId = org.id;

  // 2) Call reason
  const reasonData: CallReasonCreateInput = {
    label: 'Test Reason',
    orgId,
  };
  const reason = await prisma.callReason.create({ data: reasonData });
  reasonId = reason.id;

  // 3) Article
  const articleData: ArticleCreateInput = {
    reason: 'Test Reason',
    required: ['Please verify this'],
    template: 'Hello, ...',
    url: '/kb/test',
    fullArticle: 'Full article body',
    summary: 'Summary for testing article',
    tags: ['verification', 'billing'],
    orgId,
  };
  const article = await prisma.article.create({ data: articleData });
  articleId = article.id;

  // 4) Action mapping
  const actionData: ActionCreateInput = {
    label: reason.label,
    defaultArticleId: articleId,
    callReasonId: reasonId,
    orgId,
  };
  const action = await prisma.action.create({ data: actionData });
  actionId = action.id;

  // 5) Closing checklist
  const checklistData: ClosingItemCreateInput = {
    label: 'Thank you for calling',
    orgId,
  };
  const checklist = await prisma.closingItem.create({ data: checklistData });
  checklistId = checklist.id;

  // 6) Seed member
  const memberData: MemberCreateInput = {
    memberId: seededMemberId,
    name: 'John Doe',
    dob: '1980-01-01',
    phone: '555-0001',
    streetAddress: '123 Elm St',
    city: 'Metropolis',
    state: 'IN',
    zipcode: '46012',
    country: normalizeCountry('United States'),
    orgId,
  };
  const member = await prisma.member.create({ data: memberData });
  memberId = member.id;

  // 7) Create agents
  const hash = await bcrypt.hash('P@ssw0rd', 10);

  async function createAgent(username: string, role: TestRole) {
    const agentData: AgentCreateInput = {
      name: role,
      email: `${username}@example.com`,
      username,
      passwordHash: hash,
      role,
      organization: {
        connect: { id: orgId },
      },
    };
    return prisma.agent.create({ data: agentData });
  }

  const [admin, manager, agent] = await Promise.all([
    createAgent('admin', 'ADMIN'),
    createAgent('manager', 'MANAGER'),
    createAgent('agent', 'AGENT'),
  ]);
  managerUserId = manager.id;

  // 8) Generate JWTs
  function makeToken(u: { id: string; orgId: string | null }, role: TestRole) {
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

  // 9) Seed call log
  const callLogData: CallLogCreateInput = {
    orgId,
    agentId: agent.id,
    memberId,
    reasonId,
    articleId,
    actionsTaken: ['Explained billing page', 'Reset password'],
    closingChecklist: ['Confirmed login success'],
    notes: 'difficulty logging',
  };
  const callLog = await prisma.callLog.create({ data: callLogData });
  callLogId = callLog.id;

  // 10) Escalation
  const escalationData: EscalationCreateInput = {
    orgId,
    callLogId,
    memberId,
    reason: 'Agent requested escalation',
    auditLog: { trace: 'button_press -> escalate' },
    status: 'pending',
  };
  await prisma.escalation.create({ data: escalationData });

  // 11) Training log
  const trainingLogData: TrainingLogCreateInput = {
    orgId,
    agentId: agent.id,
    callLogId,
    prompts: { checklist: 'Confirm billing was discussed' },
    responses: { agentReply: 'Yes, reviewed billing options' },
    training: true,
  };
  await prisma.trainingLog.create({ data: trainingLogData });

  // 12) Bug report
  const bugReportData: BugReportCreateInput = {
    orgId,
    errorMessage: 'Uncaught TypeError: cannot read property X of undefined',
    stackTrace: 'at Dashboard.render (/src/components/Dashboard.tsx:27:15)',
    userContext: {
      browser: 'Chrome',
      screenSize: '1920x1080',
      steps: ['logged in', 'clicked dashboard'],
    },
    screenshotUrl: 'https://example.com/test-screenshot.png',
    stepsToReproduce: 'Navigate to dashboard after login',
  };
  await prisma.bugReport.create({ data: bugReportData });
});

afterAll(async () => {
  await prisma.$disconnect();
});
