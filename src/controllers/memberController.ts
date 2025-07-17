import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

// GET /organizations/:orgId/members
export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const members = await prisma.member.findMany({ where: { orgId } });
    res.json(members);
  } catch (err) {
    next(err);
  }
};

// POST /organizations/:orgId/members
export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const {
      memberId,
      name,
      dob,
      phone,
      streetAddress,
      city,
      state,
      zipcode,
    } = req.body;

    const member = await prisma.member.create({
      data: {
        memberId,
        name,
        dob,
        phone,
        streetAddress,
        city,
        state,
        zipcode,
        orgId,
      },
    });

    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

// POST /organizations/:orgId/members/validate
export const validateMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { validationFields: true },
    });

    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Build dynamic filter based on validationFields
    const filters: Record<string, any> = { orgId };
    for (const field of org.validationFields) {
      if (req.body[field]) {
        filters[field] = req.body[field];
      }
    }

    const matchCount = await prisma.member.count({ where: filters });
    const valid = matchCount > 0;

    res.json({ valid });
  } catch (err) {
    next(err);
  }
};