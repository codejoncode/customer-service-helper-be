import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import type { Article } from "../generated/prisma";

export const getReasons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params;
    const reasons = await prisma.callReason.findMany({ where: { orgId } });
    res.json(reasons);
  } catch (err) {
    next(err);
  }
};

export const getReasonArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orgId, reasonId } = req.params;

    // 1) Tell TS exactly what shape comes back
    const mappings: Array<{ defaultArticle: Article | null }> =
      await prisma.action.findMany({
        where: { orgId, callReasonId: reasonId },
        select: { defaultArticle: true },
      });

    // 2) Now TS knows:
    //    mappings is Array<{ defaultArticle: Article | null }>
    // so m.defaultArticle is Article|null

    const articles: Article[] = mappings
      .map(
        (m: { defaultArticle: Article | null }): Article | null =>
          m.defaultArticle
      )
      .filter((a: Article | null): a is Article => a !== null);

    res.json(articles);
  } catch (err) {
    next(err);
  }
};
