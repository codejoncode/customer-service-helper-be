// src/controllers/memberController.ts

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
  const { orgId } = req.params;
  const { memberId, name, dob, phone, streetAddress, city, state, zipcode } = req.body;

  // 400 if any required field is missing
  if (!memberId || !name || !dob || !phone || !streetAddress || !city || !state || !zipcode) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
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

    // only look at the org's validationFields
    const provided = org.validationFields.filter(
      field => req.body[field] !== undefined && req.body[field] !== '',
    );

    // no validation inputs → automatically invalid
    if (provided.length === 0) {
      return res.json({ valid: false });
    }

    // build filters from provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = { orgId };
    for (const field of provided) {
      filters[field] = req.body[field];
    }

    const count = await prisma.member.count({ where: filters });
    res.json({ valid: count > 0 });
  } catch (err) {
    next(err);
  }
};
