import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export const getValidationRules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params;
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { validationFields: true },
    });
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json({ validationFields: org.validationFields });
  } catch (err) {
    next(err);
  }
};
