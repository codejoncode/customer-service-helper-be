import { Request, Response, NextFunction } from 'express';
import Papa from 'papaparse';
import { prisma } from '../config/db';
import { chunkArray } from '../utils/chunkArray';
import { normalizeState } from '../utils/normalizeState';
import { normalizeCountry } from '../utils/normalizeCountry';
import { MemberInput } from '../types/MemberInput';
import { validateMemberRow } from '../utils/validateMemberRow';

export const getMemberById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId, memberId } = req.params;
    const member = await prisma.member.findFirst({
      where: { orgId, memberId },
      select: {
        memberId: true,
        name: true,
        dob: true,
        phone: true,
        streetAddress: true,
        city: true,
        state: true,
        zipcode: true,
        country: true,
      },
    });
    if (!member) return res.status(404).json({ message: 'Not found' });
    res.json(member);
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orgId } = req.params;
    const { memberId, name, dob, phone, streetAddress, city, state, zipcode } = req.body;
    const country = req.body.country || 'US';

    if (
      !memberId ||
      !name ||
      !dob ||
      !phone ||
      !streetAddress ||
      !city ||
      !state ||
      !zipcode ||
      !country
    ) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const member = await prisma.member.create({
      data: {
        memberId,
        name,
        dob,
        phone,
        streetAddress,
        city,
        state: normalizeState(state),
        zipcode,
        country: normalizeCountry(country),
        orgId,
      },
    });

    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

export const bulkAddOrUpdateMembers = async (req: Request, res: Response, next: NextFunction) => {
  const { orgId } = req.params;
  const members = req.body;

  if (!Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ error: 'Request body must be a non-empty array' });
  }

  let createdCount = 0;
  let updatedCount = 0;
  const errors: { memberId: string; message: string }[] = [];

  for (const entry of members) {
    const { memberId, name, dob, phone, streetAddress, city, state, zipcode, country } = entry;

    if (
      !memberId ||
      !name ||
      !dob ||
      !phone ||
      !streetAddress ||
      !city ||
      !state ||
      !zipcode ||
      !country
    ) {
      errors.push({ memberId, message: 'Missing required fields' });
      continue;
    }

    try {
      const existing = await prisma.member.findFirst({ where: { memberId, orgId } });

      if (existing) {
        await prisma.member.update({
          where: { id: existing.id },
          data: {
            name,
            dob,
            phone,
            streetAddress,
            city,
            state: normalizeState(state),
            zipcode,
            country: normalizeCountry(country),
          },
        });
        updatedCount++;
      } else {
        await prisma.member.create({
          data: {
            memberId,
            name,
            dob,
            phone,
            streetAddress,
            city,
            state: normalizeState(state),
            zipcode,
            country: normalizeCountry(country),
            orgId,
          },
        });
        createdCount++;
      }
    } catch (err: any) {
      errors.push({
        memberId,
        message: err.message || 'Unexpected error',
      });
    }
  }

  return res.json({ created: createdCount, updated: updatedCount, errors });
};

export const uploadMembersCsv = async (req: Request, res: Response, next: NextFunction) => {
  const { orgId } = req.params;
  const uploaderId = req.user?.userId || 'unknown';
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'CSV file required' });
  }

  try {
    const csvText = file.buffer.toString('utf-8');
    const { data, errors: parseErrors } = Papa.parse<MemberInput>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const filename = file.originalname || 'members.csv';

    const importJob = await prisma.importJob.create({
      data: {
        orgId,
        filename,
        status: 'processing',
        uploadedBy: uploaderId,
      },
    });

    let created = 0;
    let updated = 0;
    const failed: { row: number; memberId?: string; error: string }[] = [];

    const batches = chunkArray(data, 500);

    for (let batch of batches) {
      for (let i = 0; i < batch.length; i++) {
        const row = batch[i];
        const rowErrors = validateMemberRow(row);
        if (rowErrors.length) {
          failed.push({
            row: i + 2,
            memberId: row.memberId,
            error: rowErrors.join('; '),
          });
          continue;
        }

        const { memberId, name, dob, phone, streetAddress, city, state, zipcode, country } = row;

        const formattedState = normalizeState(state);
        const formattedCountry = normalizeCountry(country);

        try {
          const existing = await prisma.member.findFirst({
            where: { memberId, orgId },
          });

          if (existing) {
            await prisma.member.update({
              where: { id: existing.id },
              data: {
                name,
                dob,
                phone,
                streetAddress,
                city,
                state: formattedState,
                zipcode,
                country: formattedCountry,
              },
            });
            updated++;
          } else {
            await prisma.member.create({
              data: {
                memberId,
                name,
                dob,
                phone,
                streetAddress,
                city,
                state: formattedState,
                zipcode,
                country: formattedCountry,
                orgId,
              },
            });
            created++;
          }
        } catch (err: any) {
          failed.push({
            row: i + 2,
            memberId,
            error: err.message || 'Unexpected error',
          });
        }
      }
    }

    await prisma.importJob.update({
      where: { id: importJob.id },
      data: {
        status: 'completed',
        created,
        updated,
        failed: failed.length,
        errorLog: failed,
      },
    });

    return res.status(200).json({
      jobId: importJob.id,
      filename,
      status: 'completed',
      summary: { created, updated, failed: failed.length },
      parseErrors,
    });
  } catch (err) {
    next(err);
  }
};
