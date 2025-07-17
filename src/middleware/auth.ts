import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Role } from '../types/Role'

// augment Express Request to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        orgId: string 
        role: 'ADMIN' | 'MANAGER' | 'AGENT'
      }
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

/**
 * Verifies the JWT from the Authorization header
 * and attaches `user` to req
 */
export default async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload

    // ensure we have the expected fields
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.orgId !== 'string' ||
      typeof payload.role !== 'string' 
    ) {
      throw new Error('Invalid token payload')
    }

    req.user = {
      userId: payload.userId,
      orgId: payload.orgId,
      role: payload.role as Role
    }
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}



