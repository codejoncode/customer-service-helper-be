import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generate(req: Request, res: Response) {
  const callLogId = req.body.callLogId;
  const orgId = req.params.orgId;
  const requester = req.user?.userId;

  if (!callLogId || !orgId) {
    return res.status(400).json({ error: 'Missing callLogId or orgId.' });
  }

  try {
    const callLog = await prisma.callLog.findUnique({
      where: { id: callLogId },
    });

    if (!callLog || callLog.orgId !== orgId) {
      return res.status(404).json({ error: 'Call log not found or organization mismatch.' });
    }

    const summaryText = `Call summary for member ${callLog.memberId}: ${callLog.notes?.slice(0, 100)}...`;

    const newSummary = await prisma.callSummary.create({
      data: {
        callLogId: callLog.id,
        orgId,
        summaryText,
        actionsTaken: callLog.actionsTaken,
        notes: callLog.notes,
        checklist: callLog.closingChecklist,
        createdBy: `userId: ${requester}`,
      },
    });

    res.status(201).json(newSummary);
  } catch (err) {
    console.error('❌ CallSummary generate error:', err);
    res.status(500).json({ error: 'Unable to generate call summary.' });
  }
}

export async function getById(req: Request, res: Response) {
  const { id, orgId } = req.params;
  const summaryId = parseInt(id);

  if (isNaN(summaryId)) {
    return res.status(400).json({ error: 'Invalid summary ID format.' });
  }

  try {
    const summary = await prisma.callSummary.findUnique({ where: { id: summaryId } });

    if (!summary || summary.orgId !== orgId) {
      return res.status(404).json({ error: 'Call summary not found.' });
    }

    res.json(summary);
  } catch (err) {
    console.error('❌ CallSummary getById error:', err);
    res.status(500).json({ error: 'Unable to fetch summary.' });
  }
}
