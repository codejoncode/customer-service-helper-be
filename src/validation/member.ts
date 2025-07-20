import { z } from 'zod';

export const memberSchema = z.object({
  memberId: z.string(),
  name: z.string(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date format
  phone: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
});
