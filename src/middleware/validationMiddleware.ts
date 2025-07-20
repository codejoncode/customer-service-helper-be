import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const memberSchema = z.object({
  name: z.string().min(1),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  phone: z.string().min(10).max(15),
  streetAddress: z.string().min(1),
  zipcode: z.string().length(5),
});

export function validateMemberInput(req: Request, res: Response, next: NextFunction) {
  const result = memberSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input.', details: result.error.format() });
  }
  req.body = result.data; // sanitized
  next();
}
