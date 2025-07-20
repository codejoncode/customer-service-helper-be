import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
export const prisma = new PrismaClient();
