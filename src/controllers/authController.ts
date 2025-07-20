// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { orgName, adminName, username, password, email } = req.body;

  // 400 if any required field is missing
  if (!orgName || !adminName || !username || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // create organization
    const org = await prisma.organization.create({
      data: { name: orgName },
    });

    // hash password & create admin agent
    const hash = await bcrypt.hash(password, 10);
    const agent = await prisma.agent.create({
      data: {
        name: adminName,
        email,
        username,
        passwordHash: hash,
        role: 'ADMIN',
        organization: {
          connect: { id: org.id },
        },
      },
    });

    // sign JWT
    const token = jwt.sign({ userId: agent.id, role: agent.role, orgId: org.id }, JWT_SECRET, {
      expiresIn: '8h',
    });

    return res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  // 400 if missing credentials
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    const agent = await prisma.agent.findUnique({ where: { username } });
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

    return res.json({ token });
  } catch (err) {
    next(err);
  }
};
