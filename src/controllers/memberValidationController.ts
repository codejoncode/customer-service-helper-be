// src/controllers/memberController.ts
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const members = await prisma.member.findMany({ where: { orgId } });
    res.json(members);
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  const { orgId } = req.params;
  const { memberId, name, dob, phone, streetAddress, city, state, zipcode } = req.body;

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

export const validateMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId, memberId } = req.params;
    const { name, dob, phone, streetAddress, zipcode } = req.body;

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { validationFields: true },
    });
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });
    if (!member || member.orgId !== orgId) {
      return res.status(404).json({ message: 'Member not found or org mismatch' });
    }

    const results = {
      name: member.name === name,
      dob: member.dob === dob,
      phone: member.phone === phone,
      streetAddress: member.streetAddress === streetAddress,
      zipcode: member.zipcode === zipcode,
    };

    const matchedFields = Object.entries(results)
      .filter(([_, matched]) => matched)
      .map(([field]) => field);

    const failedFields = Object.entries(results)
      .filter(([_, matched]) => !matched)
      .map(([field]) => field);

    const valid = matchedFields.length >= 2;

    res.json({
      valid,
      results,
      matchedFields,
      failedFields,
    });
  } catch (err) {
    console.error('Validation error:', err);
    next(err);
  }
};
