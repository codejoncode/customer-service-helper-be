import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const SALT_ROUNDS = 10;

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { orgName, adminName, username, password, email } = req.body;

  // 1) Validate all required fields
  if (!orgName || !adminName || !username || !password || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 2) Check if org name or credentials conflict
    const [orgExists, emailExists, usernameExists] = await Promise.all([
      prisma.organization.findUnique({ where: { name: orgName } }),
      prisma.agent.findUnique({ where: { email } }),
      prisma.agent.findUnique({ where: { username } }),
    ]);

    if (orgExists) {
      return res.status(409).json({ message: 'Organization name already in use' });
    }
    if (emailExists) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    if (usernameExists) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // 3) Create org & agent
    const org = await prisma.organization.create({
      data: { name: orgName },
    });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const agent = await prisma.agent.create({
      data: {
        name: adminName,
        email,
        username,
        passwordHash,
        role: 'ADMIN',
        organization: { connect: { id: org.id } },
      },
    });

    // 4) Issue JWT
    const token = jwt.sign({ userId: agent.id, role: agent.role, orgId: org.id }, JWT_SECRET, {
      expiresIn: '8h',
    });

    return res.status(200).json({ token });
  } catch (err) {
    if (
      err instanceof PrismaClientKnownRequestError &&
      err.code === 'P2002' &&
      Array.isArray(err.meta?.target)
    ) {
      // Just in case: handle any other unique-constraint fallback
      const field = (err.meta.target as string[])[0];
      return res.status(409).json({ message: `${field} already in use.` });
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    const agent = await prisma.agent.findUnique({
      where: { username },
    });
    if (!agent) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, agent.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: agent.id, role: agent.role, orgId: agent.orgId }, JWT_SECRET, {
      expiresIn: '8h',
    });
    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
