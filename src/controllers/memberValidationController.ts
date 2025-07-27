import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

/**
 * POST /api/orgs/:orgId/members/:memberId/validate
 */
export const validateMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId, memberId } = req.params;
    const { name, dob, phone, streetAddress, zipcode } = req.body;

    // 1) Confirm org exists and get fields to validate
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { validationFields: true },
    });
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // 2) Lookup member by external memberId + org
    const member = await prisma.member.findFirst({
      where: { orgId, memberId },
    });
    if (!member) {
      return res.status(404).json({ message: 'Member not found or org mismatch' });
    }

    // 3) Compare fields
    const results: Record<string, boolean> = {
      name: member.name === name,
      dob: member.dob === dob,
      phone: member.phone === phone,
      streetAddress: member.streetAddress === streetAddress,
      zipcode: member.zipcode === zipcode,
    };

    // 4) Partition matched vs failed
    const matchedFields = Object.entries(results)
      .filter(([_, ok]) => ok)
      .map(([field]) => field);
    const failedFields = Object.entries(results)
      .filter(([_, ok]) => !ok)
      .map(([field]) => field);

    // 5) Valid if at least two fields match
    const valid = matchedFields.length >= 2;

    return res.json({ valid, results, matchedFields, failedFields });
  } catch (err) {
    console.error('Validation error:', err);
    return next(err);
  }
};
