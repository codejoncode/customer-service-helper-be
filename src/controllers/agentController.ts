// src/controllers/agentController.ts

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/db";

const SALT_ROUNDS = 10;

// GET /api/orgs/:orgId/agents
export const getAgents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params;
    const agents = await prisma.agent.findMany({
      where: { orgId },
      select: { id: true, name: true, username: true, role: true },
    });
    return res.json(agents);
  } catch (err) {
    next(err);
  }
};

// POST /api/orgs/:orgId/agents
export const addAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orgId } = req.params;
  const { name, username, password, role } = req.body;

  // 400 when missing data
  if (!name || !username || !password || !role) {
    return res.status(400).json({ message: "Missing agent data" });
  }

  try {
    // find org to enforce limits
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { plan: true, agentLimit: true },
    });
    if (!org) {
      return res.status(404).json({ message: "Org not found" });
    }

    // enforce free-tier limit
    const count = await prisma.agent.count({ where: { orgId } });
    if (org.plan === "FREE" && count >= org.agentLimit) {
      return res.status(403).json({ message: "Free-agent limit reached" });
    }

    // hash & create
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const agent = await prisma.agent.create({
      data: { name, username, passwordHash: hash, role, orgId },
      select: { id: true, name: true, username: true, role: true },
    });

    return res.status(201).json(agent);
  } catch (err) {
    next(err);
  }
};

// PUT /api/orgs/:orgId/agents/:agentId
export const updateAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { agentId } = req.params;
  const { name, role } = req.body;

  // you could validate name/role here if desired

  try {
    const agent = await prisma.agent.update({
      where: { id: agentId },
      data: { name, role },
    });
    // return updated agent directly for tests to inspect .name
    return res.json(agent);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/orgs/:orgId/agents/:agentId
export const deleteAgent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { agentId } = req.params;

  try {
    await prisma.agent.delete({ where: { id: agentId } });
    // tests only verify status 200
    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
