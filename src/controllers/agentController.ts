import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../config/db'

const SALT_ROUNDS = 10

export const getAgents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params
    const agents = await prisma.agent.findMany({
      where: { orgId },
      select: { id: true, name: true, username: true, role: true }
    })
    res.json(agents)
  } catch (err) {
    next(err)
  }
}

export const addAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params
    const { name, username, password, role } = req.body
    if (!name || !username || !password || !role) {
      return res.status(400).json({ error: 'Missing agent data' })
    }

    // enforce free-tier limit
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { plan: true, agentLimit: true }
    })
    if (!org) return res.status(404).json({ error: 'Org not found' })

    const count = await prisma.agent.count({ where: { orgId } })
    if (org.plan === 'FREE' && count >= org.agentLimit) {
      return res.status(403).json({ error: 'Free-agent limit reached' })
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const agent = await prisma.agent.create({
      data: { name, username, passwordHash: hash, role, orgId },
      select: { id: true, name: true, username: true, role: true }
    })
    res.status(201).json(agent)
  } catch (err) {
    next(err)
  }
}

export const updateAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { agentId } = req.params
    const { name, role } = req.body
    const agent = await prisma.agent.update({
      where: { id: agentId },
      data: { name, role }
    })
    res.json({ message: 'Agent updated', agent })
  } catch (err) {
    next(err)
  }
}

export const deleteAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { agentId } = req.params
    await prisma.agent.delete({ where: { id: agentId } })
    res.json({ message: 'Agent deleted' })
  } catch (err) {
    next(err)
  }
}