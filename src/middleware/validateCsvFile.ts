import { Request, Response, NextFunction } from 'express';
/**
 * Reject requests with:
 * Missing file
 * wrong mimetype
 * Excessive size
 */

const MAX_CSV_SIZE = 2 * 1024 * 1024; // 2MB limit

export default function validateCsvFile(req: Request, res: Response, next: NextFunction) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'CSV file is required' });
  }

  // allow any upload as long as filename endsWith .csv
  if (!file.originalname.toLowerCase().endsWith('.csv')) {
    return res.status(415).json({ error: 'Unsupported file type' });
  }

  if (file.size > MAX_CSV_SIZE) {
    return res.status(413).json({ error: 'CSV file is too large' });
  }

  next();
}
