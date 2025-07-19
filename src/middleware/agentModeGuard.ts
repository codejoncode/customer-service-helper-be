import { Request, Response, NextFunction } from "express";

export default function agentModeGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user?.orgId) {
    return res
      .status(403)
      .json({ message: "This route is only for organization‐bound agents" });
  }
  next();
}
