import { MemberInput } from '../types/MemberInput';
import sanitizeHtml from 'sanitize-html';

/**
 * Validate each CSV row before insert/update
 * Check length constraints
 * check null / obscure characters
 * check for potential SQL injection patterns
 * check for basic html/script injection
 * check for reserved words
 * reject it all if noticed.
 */

export function validateMemberRow(row: MemberInput): string[] {
  const errors: string[] = [];

  // Required fields
  if (!row.memberId?.trim()) errors.push('Missing memberId');
  if (!row.name?.trim()) errors.push('Missing name');
  if (!row.dob?.match(/^\d{4}-\d{2}-\d{2}$/))
    errors.push('Invalid dob format (YYYY-MM-DD required)');
  if (!row.phone?.trim()) errors.push('Missing phone');
  if (!row.streetAddress?.trim()) errors.push('Missing street address');
  if (!row.city?.trim()) errors.push('Missing city');
  if (!row.state?.trim()) errors.push('Missing state');
  if (!row.country?.trim()) errors.push('Missing country');
  if (!row.zipcode?.trim()) errors.push('Missing zipcode');

  // Length constraints
  if (row.name?.length > 100) errors.push('Name exceeds max length');
  if (row.streetAddress?.length > 255) errors.push('Street address too long');
  if (row.city?.length > 100) errors.push('City name too long');
  if (row.phone?.length > 20) errors.push('Phone number too long');
  if (row.zipcode?.length > 20) errors.push('Zipcode too long');

  // Null/obscure character check
  const containsNullChar = /[\u0000]/;
  if (containsNullChar.test(row.name ?? '')) errors.push('Name contains null character');

  // Potential SQL injection patterns
  const dangerousPattern = /('|;|--|\/\*|\*\/)/;
  const fieldsToInspect = [row.memberId, row.name, row.phone, row.city, row.zipcode];
  for (const field of fieldsToInspect) {
    if (field && dangerousPattern.test(field)) {
      errors.push(`Field contains unsafe characters: "${field}"`);
    }
  }

  // Basic HTML/script injection
  const checkHtmlField = (label: string, value?: string) => {
    const cleaned = sanitizeHtml(value ?? '', { allowedTags: [], allowedAttributes: {} });
    if (cleaned !== value) {
      errors.push(`${label} contains disallowed HTML or script`);
    }
  };

  checkHtmlField('Name', row.name);
  checkHtmlField('Street Address', row.streetAddress);
  checkHtmlField('City', row.city);

  // Reserved words
  const blockedNames = ['admin', 'root', 'delete'];
  if (blockedNames.includes(row.name?.toLowerCase() ?? '')) {
    errors.push('Name uses reserved word');
  }

  return errors;
}
