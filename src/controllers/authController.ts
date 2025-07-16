import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgName, adminName, username, password } = req.body
    if (!orgName || !adminName || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // create organization
    const org = await prisma.organization.create({
      data: { name: orgName }
    })

    // hash password & create admin agent
    const hash = await bcrypt.hash(password, 10)
    const agent = await prisma.agent.create({
      data: {
        name: adminName,
        username,
        passwordHash: hash,
        role: 'ADMIN',
        orgId: org.id
      }
    })

    // sign JWT
    const token = jwt.sign(
      { userId: agent.id, role: agent.role, orgId: org.id },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({ token })
  } catch (err) {
    next(err)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' })
    }

    const agent = await prisma.agent.findUnique({ where: { username } })
    if (!agent) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, agent.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: agent.id, role: agent.role, orgId: agent.orgId },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({ token })
  } catch (err) {
    next(err)
  }
}