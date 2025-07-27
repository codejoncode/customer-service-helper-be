import { prisma } from '../config/db';
import { Prisma, PrismaClient } from '@prisma/client';

type StringKeys<T> = Extract<keyof T, string>;

type ModelWithCreate = {
  [K in StringKeys<typeof prisma>]: (typeof prisma)[K] extends { create: Function } ? K : never;
}[StringKeys<typeof prisma>];

type CreateInput<K extends keyof PrismaClient> = PrismaClient[K] extends {
  create(args: { data: infer D }): any;
}
  ? D
  : never;

type UpdateInput<K extends keyof PrismaClient> = PrismaClient[K] extends {
  update(args: { data: infer D }): any;
}
  ? D
  : never;

export type OrganizationCreateInput = CreateInput<'organization'>;
export type AgentCreateInput = CreateInput<'agent'>;
export type MemberCreateInput = CreateInput<'member'>;
export type ActionCreateInput = CreateInput<'action'>;
export type ArticleCreateInput = CreateInput<'article'>;
export type EscalationCreateInput = CreateInput<'escalation'>;
export type TrainingLogCreateInput = CreateInput<'trainingLog'>;
export type BugReportCreateInput = CreateInput<'bugReport'>;
export type ClosingItemCreateInput = CreateInput<'closingItem'>;
export type CallReasonCreateInput = CreateInput<'callReason'>;
export type CallLogCreateInput = CreateInput<'callLog'>;
export type FAQCreateInput = CreateInput<'fAQ'>;
export type CallSummaryCreateInput = CreateInput<'callSummary'>;
export type MemberValidationLogCreateInput = CreateInput<'memberValidationLog'>;
export type ImportJobCreateInput = CreateInput<'importJob'>;

export type OrganizationUpdateInput = UpdateInput<'organization'>;
export type AgentUpdateInput = UpdateInput<'agent'>;
export type MemberUpdateInput = UpdateInput<'member'>;
export type ActionUpdateInput = UpdateInput<'action'>;
export type ArticleUpdateInput = UpdateInput<'article'>;
export type EscalationUpdateInput = UpdateInput<'escalation'>;
export type TrainingLogUpdateInput = UpdateInput<'trainingLog'>;
export type BugReportUpdateInput = UpdateInput<'bugReport'>;
export type ClosingItemUpdateInput = UpdateInput<'closingItem'>;
export type CallReasonUpdateInput = UpdateInput<'callReason'>;
export type CallLogUpdateInput = UpdateInput<'callLog'>;
export type FAQUpdateInput = UpdateInput<'fAQ'>;
export type CallSummaryUpdateInput = UpdateInput<'callSummary'>;
export type MemberValidationLogUpdateInput = UpdateInput<'memberValidationLog'>;
export type ImportJobUpdateInput = UpdateInput<'importJob'>;
