import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

type Article = Awaited<ReturnType<typeof prisma.article.findUnique>>;

/** GET /api/orgs/:orgId/articles */
export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const articles = await prisma.article.findMany({ where: { orgId } });
    res.json(articles);
  } catch (err) {
    next(err);
  }
};

/** GET /api/orgs/:orgId/articles/:id */
export const getArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return res.status(404).json({ message: 'Not found' });
    res.json(article);
  } catch (err) {
    next(err);
  }
};

/** POST /api/orgs/:orgId/articles */
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const { reason, required, template, url, fullArticle, tags = [], summary = '' } = req.body;

    const article = await prisma.article.create({
      data: { reason, required, template, url, fullArticle, orgId, tags, summary },
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/orgs/:orgId/articles/:id */
export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const article = await prisma.article.update({ where: { id }, data });
    res.json(article);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/orgs/:orgId/articles/:id */
export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

/** POST /api/orgs/:orgId/articles/suggest */
export const suggestArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const { callReason = '', checklistItem = '' } = req.body;

    if (!callReason && !checklistItem) {
      return res.status(400).json({ error: 'Either callReason or checklistItem is required.' });
    }

    const terms = [callReason, checklistItem].map(term => term.toLowerCase()).filter(Boolean);

    const articles = await prisma.article.findMany({
      where: { orgId, tags: { hasSome: terms } },
      orderBy: { createdAt: 'desc' },
    });

    const suggestions = (articles as Article[])
      .filter((a): a is Article => a !== null)
      .map(a => ({
        title: a?.reason ?? 'Untitled',
        url: a?.url ?? '',
        summary: a?.summary ?? 'No summary available',
        inlineSuggestions: [
          `Consider sharing this: "${a?.template ?? 'No template'}"`,
          `This article might help: ${a?.url ?? '#'}`,
        ],
      }));

    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
};
