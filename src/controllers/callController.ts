import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export const createCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orgId } = req.params;
    const {
      memberId,
      agentId,
      reasonId,
      articleId,
      actionsTaken,
      closingChecklist,
      notes,
    } = req.body;

    if (
      !memberId ||
      !agentId ||
      !reasonId ||
      !articleId ||
      !Array.isArray(actionsTaken) ||
      !Array.isArray(closingChecklist) ||
      !notes
    ) {
      return res.status(400).json({ message: "Missing call data" });
    }

    const callLog = await prisma.callLog.create({
      data: {
        orgId,
        memberId,
        agentId,
        reasonId,
        articleId,
        actionsTaken,
        closingChecklist,
        notes,
      },
    });
    res.status(201).json(callLog);
  } catch (err) {
    next(err);
  }
};

export const generateCallNotes = (req: Request, res: Response) => {
  const { memberId, reason, articleTitle, actionsTaken, closingChecklist } =
    req.body;

  let summary = `Member: ${memberId}\nReason: ${reason}\n\nActions Taken:\n`;
  actionsTaken.forEach((a: string) => (summary += `- ${a}\n`));

  summary += `\nClosing Prompts:\n`;
  closingChecklist.forEach((c: string) => (summary += `- ${c}\n`));

  res.json({ notes: summary });
};
