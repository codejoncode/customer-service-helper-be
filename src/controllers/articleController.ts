import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export const getArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params;
    const articles = await prisma.article.findMany({ where: { orgId } });
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return res.status(404).json({ message: "Not found" });
    res.json(article);
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params;
    const { reason, required, template, url, fullArticle } = req.body;
    const article = await prisma.article.create({
      data: { reason, required, template, url, fullArticle, orgId },
    });
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

export const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const article = await prisma.article.update({ where: { id }, data });
    res.json(article);
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
