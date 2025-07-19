import { Role } from "./Role";

declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      role: Role;
      orgId: string;
    };
  }
}
