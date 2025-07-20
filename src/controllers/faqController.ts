/* eslint-disable no-unused-vars */
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** GET /api/orgs/:orgId/faqs → List FAQs */
export async function list(_req: Request, res: Response) {
  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(faqs);
  } catch (err) {
    console.error('FAQ list error:', err);
    res.status(500).json({ error: 'Failed to list FAQs' });
  }
}

/** GET /api/orgs/:orgId/faqs/tags → List all unique tags */
export async function tags(_req: Request, res: Response) {
  try {
    const allFaqs = await prisma.fAQ.findMany({ select: { tags: true } });
    const tagSet = new Set<string>();
    allFaqs.forEach((faq: { tags: string[] }) =>
      faq.tags.forEach((tag: string) => tagSet.add(tag.toLowerCase())),
    );
    res.json({ tags: Array.from(tagSet).sort() });
  } catch (err) {
    console.error('FAQ tags error:', err);
    res.status(500).json({ error: 'Unable to fetch tags.' });
  }
}

/** GET /api/orgs/:orgId/faqs/search?q=term&page=1&limit=10 */
export async function search(req: Request, res: Response) {
  const { q = '', page = '1', limit = '10' } = req.query;
  const search = q.toString().trim();
  const take = parseInt(limit.toString());
  const skip = (parseInt(page.toString()) - 1) * take;

  if (!search) return res.status(400).json({ error: 'Search query is required.' });

  try {
    const faqs = await prisma.fAQ.findMany({
      where: {
        OR: [
          { question: { contains: search, mode: 'insensitive' } },
          { answer: { contains: search, mode: 'insensitive' } },
          { tags: { has: search.toLowerCase() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const total = await prisma.fAQ.count({
      where: {
        OR: [
          { question: { contains: search, mode: 'insensitive' } },
          { answer: { contains: search, mode: 'insensitive' } },
          { tags: { has: search.toLowerCase() } },
        ],
      },
    });

    res.json({ total, page: +page, limit: take, faqs });
  } catch (err) {
    console.error('FAQ search error:', err);
    res.status(500).json({ error: 'Search failed.' });
  }
}

/** GET /api/orgs/:orgId/faqs/:id → Get single FAQ by ID */
export async function byId(req: Request, res: Response) {
  const { id } = req.params;
  const numericId = parseInt(id);
  if (!numericId) return res.status(400).json({ error: 'Invalid FAQ ID format' });

  try {
    const faq = await prisma.fAQ.findUnique({ where: { id: numericId } });
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json(faq);
  } catch (err) {
    console.error('FAQ fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
}

/** POST /api/orgs/:orgId/faqs → Create new FAQ */
export async function create(req: Request, res: Response) {
  const { question, answer, tags } = req.body;
  const { orgId } = req.params;

  if (!question || !answer || !Array.isArray(tags)) {
    return res.status(400).json({ error: 'Missing or invalid FAQ fields.' });
  }

  const createdBy = `userId: ${req.user?.userId} - orgId: ${req.user?.orgId}`;
  try {
    const newFaq = await prisma.fAQ.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        tags: tags.map(t => t.toLowerCase().trim()),
        createdBy,
      },
    });
    res.status(201).json(newFaq);
  } catch (err) {
    console.error('FAQ creation error:', err);
    res.status(500).json({ error: 'Unable to add FAQ.' });
  }
}
