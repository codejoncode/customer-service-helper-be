import { Role } from './Role';
import * as multer from 'multer';

declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      role: Role;
      orgId: string;
    };
    file?: multer.File;
    files?: multer.File[];
  }
}

export {};
