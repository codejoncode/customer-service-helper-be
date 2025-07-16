import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/db'

export const getAllOrgs = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgs = await prisma.organization.findMany({
      include: {
        agents: { select: { id: true, name: true, username: true, role: true } }
      }
    })
    res.json(orgs)
  } catch (err) {
    next(err)
  }
}

export const getOrgById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        agents: {
          select: { id: true, name: true, username: true, role: true }
        },
        members: true,
        actions: true,
        articles: true,
        closingItems: true,
        callReasons: true
      }
    })
    if (!org) return res.status(404).json({ error: 'Organization not found' })
    res.json(org)
  } catch (err) {
    next(err)
  }
}

export const createOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'Missing name' })

    const org = await prisma.organization.create({ data: { name } })
    res.status(201).json(org)
  } catch (err) {
    next(err)
  }
}

export const updateOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params
    const data = req.body
    const org = await prisma.organization.update({
      where: { id: orgId },
      data
    })
    res.json(org)
  } catch (err) {
    next(err)
  }
}

export const deleteOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params
    await prisma.organization.delete({ where: { id: orgId } })
    res.json({ message: 'Organization deleted' })
  } catch (err) {
    next(err)
  }
}

export const upgradeOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params
    const org = await prisma.organization.update({
      where: { id: orgId },
      data: { plan: 'PAID', agentLimit: 1000 }
    })
    res.json({ message: 'Upgraded to paid', org })
  } catch (err) {
    next(err)
  }
}