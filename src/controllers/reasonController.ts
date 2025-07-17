import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/db'

export const getReasons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params
    const reasons = await prisma.callReason.findMany({ where: { orgId } })
    res.json(reasons)
  } catch (err) {
    next(err)
  }
}

export const getReasonArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId, reasonId } = req.params
    const mappings = await prisma.action.findMany({
      where: { orgId, callReasonId: reasonId },
      include: { defaultArticle: true },
    })
    const articles = mappings.map((m: { defaultArticle: any }) => m.defaultArticle)
    res.json(articles)
  } catch (err) {
    next(err)
  }
}