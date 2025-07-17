import { prisma } from './config/db';
import bcrypt from 'bcrypt';
import {knowledgeBase} from "./data/knowledgeBase";

async function main() {
  console.log('🗑 Dropping existing data...');
  await prisma.callReason.deleteMany();
  await prisma.closingItem.deleteMany();
  await prisma.article.deleteMany();
  await prisma.action.deleteMany();
  await prisma.member.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.organization.deleteMany();

  console.log('🚀 Seeding 3 organizations...');
  for (let i = 1; i <= 3; i++) {
    const org = await prisma.organization.create({
      data: {
        name: `Organization ${i}`,
        actions: {
          create: [
            { label: 'Give Information' },
            { label: 'Change Account Details' }
          ]
        },
        articles: {
          create: knowledgeBase.map((entry) => ({
            reason: entry.reason,
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
            { label: 'Please hold for survey' }
          ]
        },
        callReasons: {
          create: [
            { label: 'Reset Password' },
            { label: 'Change Shipping Address' }
          ]
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
              zipcode: '46012'
            },
            {
              memberId: `org${i}M2`,
              name: `Member${i}-2`,
              dob: '1981-02-02',
              phone: '555-0002',
              streetAddress: '456 Oak St',
              city: 'Gotham',
              state: 'IN',
              zipcode: '46013'
            }
          ]
        },
        agents: {
          create: await Promise.all(
            [1, 2].map(async (n) => ({
              name: `Agent${i}${n}`,
              username: `org${i}_agent${n}`,
              passwordHash: await bcrypt.hash(`pass${i}${n}`, 10),
              role: n === 1 ? 'AGENT' : 'MANAGER'
            }))
          )
        }
      }
    });
    console.log(`  • Created ${org.name}`);
  }

  console.log('✅ Done seeding.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });