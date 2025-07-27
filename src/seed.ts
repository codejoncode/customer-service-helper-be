import { prisma } from './config/db';
import bcrypt from 'bcrypt';
import { knowledgeBase } from './data/knowledgeBase';
import { Role } from './generated/prisma';

async function main() {
  console.log('🗑 Dropping existing data...');
  await prisma.$transaction([
    prisma.callSummary.deleteMany(),
    prisma.callLog.deleteMany(),
    prisma.escalation.deleteMany(),
    prisma.trainingLog.deleteMany(),
    prisma.bugReport.deleteMany(),
    prisma.memberValidationLog.deleteMany(),
    prisma.importJob.deleteMany(),
    prisma.agent.deleteMany(),
    prisma.member.deleteMany(),
    prisma.closingItem.deleteMany(),
    prisma.action.deleteMany(),
    prisma.article.deleteMany(),
    prisma.callReason.deleteMany(),
    prisma.organization.deleteMany(),
  ]);

  console.log('🚀 Seeding 3 organizations...');
  for (let i = 1; i <= 3; i++) {
    const org = await prisma.organization.create({
      data: {
        name: `Organization ${i}`,
        callReasons: {
          create: [
            { id: `org${i}_reason1`, label: 'Reset Password' },
            { id: `org${i}_reason2`, label: 'Change Shipping Address' },
          ],
        },
        actions: {
          create: [
            { label: 'Give Information', callReasonId: `org${i}_reason1` },
            { label: 'Change Account Details', callReasonId: `org${i}_reason2` },
          ],
        },
        articles: {
          create: knowledgeBase.map(entry => ({
            reason: entry.reason,
            summary: entry.template.slice(0, 100),
            required: entry.required,
            template: entry.template,
            url: entry.url,
            fullArticle: entry.fullArticle,
          })),
        },
        closingItems: {
          create: [
            { label: 'Is there anything else I can do for you?' },
            { label: 'Have I resolved your issues?' },
            { label: 'Please hold for survey' },
          ],
        },
        members: {
          create: [
            {
              memberId: `org${i}M1`,
              name: `Member${i}-1`,
              dob: '1980-01-01',
              phone: '555-0001',
              streetAddress: '123 Elm St',
              city: 'Metropolis',
              state: 'IN',
              zipcode: '46012',
              country: 'US',
            },
            {
              memberId: `org${i}M2`,
              name: `Member${i}-2`,
              dob: '1981-02-02',
              phone: '555-0002',
              streetAddress: '456 Oak St',
              city: 'Gotham',
              state: 'IN',
              zipcode: '46013',
              country: 'US',
            },
          ],
        },
        agents: {
          create: await Promise.all(
            [1, 2].map(async n => ({
              name: `Agent${i}${n}`,
              username: `org${i}_agent${n}`,
              email: `agent${i}${n}@example.com`,
              passwordHash: await bcrypt.hash(`pass${i}${n}`, 10),
              role: n === 1 ? Role.AGENT : Role.MANAGER,
            })),
          ),
        },
      },
    });

    console.log(`  • Created ${org.name}`);
  }

  console.log('✅ Done seeding.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
