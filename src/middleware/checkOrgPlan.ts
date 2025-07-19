import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export default async function checkOrgPlan(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const orgId = req.user?.orgId;
  if (!orgId) {
    return res.status(403).json({ message: "No organization context" });
  }
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { plan: true },
  });
  if (org?.plan === "FREE") {
    return res
      .status(403)
      .json({ message: "Upgrade to a paid plan to use this feature" });
  }
  next();
}
