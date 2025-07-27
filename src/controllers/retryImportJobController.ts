import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { normalizeState } from '../utils/normalizeState';
import { normalizeCountry } from '../utils/normalizeCountry';
import { validateMemberRow } from '../utils/validateMemberRow';

interface FailedRow {
  row: number;
  memberId: string;
  name: string;
  dob: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  [key: string]: any;
}

export const retryImportJob = async (req: Request, res: Response, next: NextFunction) => {
  const { orgId, jobId } = req.params;
  const userId = req.user?.userId;
  const role = req.user?.role;

  try {
    // 1. Load import job
    const job = await prisma.importJob.findFirst({
      where: { id: jobId, orgId },
    });
    if (!job) {
      return res.sendStatus(404);
    }

    // 2. Authorization
    const isUploader = job.uploadedBy === userId;
    const isPrivileged = role === 'ADMIN' || role === 'MANAGER';

    if (!isUploader && !isPrivileged) {
      return res.status(403).json({ error: 'Only the uploader or an admin can retry this job.' });
    }
    if (role === 'AGENT') {
      return res.status(403).json({ error: 'Agents cannot retry import jobs.' });
    }

    // 3. Retry limits
    if (job.retryCount >= 2) {
      return res.status(400).json({ error: 'Max retries reached for this job.' });
    }
    if (job.lastRetriedAt && Date.now() - job.lastRetriedAt.getTime() < 15 * 60 * 1000) {
      return res.status(429).json({ error: 'Please wait before retrying.' });
    }

    // 4. Ensure there are failed rows
    if (!Array.isArray(job.errorLog) || job.errorLog.length === 0) {
      return res.status(400).json({ error: 'No failed rows to retry.' });
    }

    // 5. Process each failed row
    let createdCount = 0;
    let updatedCount = 0;
    const stillFailed: { row: number; memberId?: string; error: string }[] = [];

    for (const entry of job.errorLog as FailedRow[]) {
      const errs = validateMemberRow(entry);
      if (errs.length) {
        stillFailed.push({
          row: entry.row,
          memberId: entry.memberId,
          error: errs.join('; '),
        });
        continue;
      }

      const { memberId, name, dob, phone, streetAddress, city, state, zipcode, country } = entry;

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
              state: formattedState,
              zipcode,
              country: formattedCountry,
              orgId,
            },
          });
          createdCount++;
        }
      } catch (err: any) {
        stillFailed.push({
          row: entry.row,
          memberId: entry.memberId,
          error: err.message || 'Unexpected error',
        });
      }
    }

    // 6. Update importJob summary
    await prisma.importJob.update({
      where: { id: jobId },
      data: {
        created: job.created + createdCount,
        updated: job.updated + updatedCount,
        failed: stillFailed.length,
        errorLog: stillFailed,
        retryCount: job.retryCount + 1,
        lastRetriedAt: new Date(),
      },
    });

    // 7. Respond
    return res.status(200).json({
      jobId,
      retried: createdCount + updatedCount,
      failed: stillFailed.length,
      summary: {
        created: job.created + createdCount,
        updated: job.updated + updatedCount,
        failed: stillFailed.length,
      },
    });
  } catch (err) {
    next(err);
  }
};
