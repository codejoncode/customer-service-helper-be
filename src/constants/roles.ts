export const Roles = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  AGENT: 'AGENT',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
