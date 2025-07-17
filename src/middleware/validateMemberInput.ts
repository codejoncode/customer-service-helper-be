import { Request, Response, NextFunction } from 'express'

export default function validateMemberInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ message: 'Invalid input body' })
  }
  next()
}