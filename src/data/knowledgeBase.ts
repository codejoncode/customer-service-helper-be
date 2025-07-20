import { KnowledgeBaseEntry } from '../models/KnowledgeBaseEntry';

export const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    reason: 'Reset Password',
    required: [
      'Verify identity with a security code',
      'Ensure the new password is at least 8 characters long',
    ],
    template: `Call Reason: Reset Password
Actions Taken:
- Verified customer's identity using a security code
- Explained new password policy`,
    url: '/articles/reset-password',
    fullArticle: `
If a customer is unable to log in, begin by verifying their identity with a security code.
Once verified, guide them through the reset process.
**Required:** Verify identity with a security code.
**Required:** Password must be at least 8 characters long and should include a mix of letters and numbers.
`,
  },
  {
    reason: 'Change Shipping Address',
    required: [
      'Confirm identity before making any changes',
      'Explain changes may delay shipment by 1–2 business days',
    ],
    template: `Call Reason: Change Shipping Address
Actions Taken:
- Verified identity before modifying delivery info
- Notified customer of possible 1–2 day delay`,
    url: '/articles/change-shipping-address',
    fullArticle: `
If a customer requests to update their shipping address post-order, identity must be verified before any changes are processed.
In many cases, changing the shipping address will require rerouting through the logistics system, which may cause **Required:** a 1–2 business day delay.
**Required:** Confirm identity with at least two authentication elements (e.g., name, order number, billing ZIP).
`,
  },
  {
    reason: 'Reset Password',
    required: [
      'Verify identity with a security code',
      'Ensure the new password is at least 8 characters long',
    ],
    template: `Call Reason: Reset Password\nActions Taken:\n- Verified identity…`,
    url: '/articles/reset-password',
    fullArticle: `If a customer …`,
  },
  // …plus Activate Warranty, Reschedule Installation entries
];
