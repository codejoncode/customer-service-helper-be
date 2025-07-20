import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../types/Role';

interface JwtPayloadRaw {
  userId: string;
  orgId: string;
  role: string; // broad
}

const ALLOWED_ROLES: Role[] = ['ADMIN', 'MANAGER', 'AGENT'];

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });

  const token = header.replace(/^Bearer\s+/, '');
  let decoded: JwtPayloadRaw;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as JwtPayloadRaw;
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Runtime guard: ensure decoded.role is one of your literal roles
  if (!ALLOWED_ROLES.includes(decoded.role as Role)) {
    return res.status(403).json({ error: 'Unexpected role in token' });
  }

  // Safe to assign
  req.user = {
    userId: decoded.userId,
    orgId: decoded.orgId,
    role: decoded.role as Role,
  };

  next();
}
