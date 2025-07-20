import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const getChecklists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const lists = await prisma.closingItem.findMany({ where: { orgId } });
    res.json(lists);
  } catch (err) {
    next(err);
  }
};

export const getChecklistById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await prisma.closingItem.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const createChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const { label } = req.body;
    const item = await prisma.closingItem.create({ data: { label, orgId } });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const updateChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const item = await prisma.closingItem.update({ where: { id }, data });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteChecklist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.closingItem.delete({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
