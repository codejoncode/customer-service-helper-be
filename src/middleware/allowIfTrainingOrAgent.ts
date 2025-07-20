// src/middleware/allowIfTrainingOrAgent.ts

import { RequestHandler } from "express";
import { Role } from "@prisma/client";

const allowIfTrainingOrAgent: RequestHandler = (req, res, next) => {
  // grab the user object your auth middleware attached
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).user as {
    userId: string;
    orgId: string;
    role: Role;
  };

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { role } = user;
  const trainingMode = req.get("X-Training-Mode") === "true";

  // Agents always allowed
  if (role === Role.AGENT) {
    return next();
  }

  // Managers/Admins only if trainingMode flag is on
  if ((role === Role.MANAGER || role === Role.ADMIN) && trainingMode) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden" });
};

export default allowIfTrainingOrAgent;
