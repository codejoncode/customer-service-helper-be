// src/controllers/orgController.ts

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

// GET /api/orgs
export const getAllOrgs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgs = await prisma.organization.findMany({
      include: {
        agents: {
          select: { id: true, name: true, username: true, role: true },
        },
      },
    });
    return res.json(orgs);
  } catch (err) {
    next(err);
  }
};

// GET /api/orgs/:orgId
export const getOrgById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        agents: {
          select: { id: true, name: true, username: true, role: true },
        },
        members: true,
        actions: true,
        articles: true,
        closingItems: true,
        callReasons: true,
      },
    });

    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    return res.json(org);
  } catch (err) {
    next(err);
  }
};

// POST /api/orgs
export const createOrg = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Missing name' });
  }

  try {
    const org = await prisma.organization.create({ data: { name } });
    return res.status(201).json(org);
  } catch (err) {
    next(err);
  }
};

// PUT /api/orgs/:orgId
export const updateOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const data = req.body;
    const org = await prisma.organization.update({
      where: { id: orgId },
      data,
    });
    return res.json(org);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/orgs/:orgId
export const deleteOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    await prisma.organization.delete({ where: { id: orgId } });
    return res.json({ message: 'Organization deleted' });
  } catch (err) {
    next(err);
  }
};

// POST /api/orgs/:orgId/upgrade
export const upgradeOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const org = await prisma.organization.update({
      where: { id: orgId },
      data: { plan: 'PAID', agentLimit: 1000 },
    });
    // Return the updated org directly so tests can read res.body.plan
    return res.json(org);
  } catch (err) {
    next(err);
  }
};
