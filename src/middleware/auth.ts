// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../types/Role';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        orgId: string;
        role: Role;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const ALLOWED_ROLES: Role[] = ['ADMIN', 'MANAGER', 'AGENT'];

export default function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;

    const { userId, orgId, role } = payload;
    if (
      typeof userId !== 'string' ||
      typeof orgId !== 'string' ||
      typeof role !== 'string' ||
      !ALLOWED_ROLES.includes(role as Role)
    ) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = { userId, orgId, role: role as Role };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
