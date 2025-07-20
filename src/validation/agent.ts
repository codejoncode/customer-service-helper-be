import { z } from 'zod';

export const agentSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['AGENT', 'MANAGER', 'ADMIN']),
});
