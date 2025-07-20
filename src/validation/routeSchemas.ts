// src/validation/routeSchemas.ts
import { agentSchema } from './agent';
import { faqSchema } from './faq';
import { memberSchema } from './member';

export const routeSchemas: Record<string, any> = {
  '/agents': agentSchema,
  '/members': memberSchema,
  '/faqs': faqSchema,
  // add more as needed
};
