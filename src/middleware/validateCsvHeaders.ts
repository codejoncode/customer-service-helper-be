import { Request, Response, NextFunction } from 'express';
import Papa from 'papaparse';
import { MemberInput } from '../types/MemberInput';

/**
 * Ensure incoming file has all expected headers.
 */

const expectedHeaders = [
  'memberId',
  'name',
  'dob',
  'phone',
  'streetAddress',
  'city',
  'state',
  'country',
  'zipcode',
];

export default function validateCsvHeaders(req: Request, res: Response, next: NextFunction) {
  const file = req.file;
  const csvText = file?.buffer.toString('utf-8') || '';
  const result = Papa.parse<MemberInput>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = result.meta.fields || [];
  const missing = expectedHeaders.filter(h => !headers.includes(h));

  if (missing.length) {
    return res.status(400).json({ error: `Missing required headers: ${missing.join(', ')}` });
  }

  // Attach parsed data to request for downstream access
  req.body._parsedCsv = result.data;
  req.body._parseErrors = result.errors;

  next();
}
