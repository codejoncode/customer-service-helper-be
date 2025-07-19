import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export const getActions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params;
    const actions = await prisma.action.findMany({ where: { orgId } });
    res.json(actions);
  } catch (err) {
    next(err);
  }
};

export const getActionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const action = await prisma.action.findUnique({ where: { id } });
    if (!action) return res.status(404).json({ message: "Not found" });
    res.json(action);
  } catch (err) {
    next(err);
  }
};

export const createOrUpdateMapping = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { reasonId, articleId } = req.body;
  if (!reasonId || !articleId) {
    return res
      .status(400)
      .json({ message: "reasonId and articleId are required" });
  }

  // verify existence
  const reason = await prisma.callReason.findUnique({
    where: { id: reasonId },
  });
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!reason || !article) {
    return res.status(404).json({ message: "Invalid reason or article ID" });
  }

  // upsert mapping
  const mapping = await prisma.action.upsert({
    where: { id: `${reasonId}-${articleId}` },
    create: {
      label: reason.label,
      callReasonId: reasonId,
      defaultArticleId: articleId,
      orgId: reason.orgId,
    },
    update: { defaultArticleId: articleId },
  });

  return res.json(mapping);
};

export const updateMapping = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const action = await prisma.action.update({ where: { id }, data });
    res.json(action);
  } catch (err) {
    next(err);
  }
};

export const deleteMapping = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await prisma.action.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
