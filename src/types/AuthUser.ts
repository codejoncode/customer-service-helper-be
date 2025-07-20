import { Role } from './Role';

export interface AuthUser {
  userId: string;
  orgId: string;
  role: Role;
}
