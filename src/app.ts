import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

// ---- Routers ----
import authRouter from './routes/authRoutes';
import orgRouter from './routes/orgRoutes';
import agentRouter from './routes/agentRoutes';
import memberRouter from './routes/memberRoutes';
import memberValidationRouter from './routes/memberValidationRoutes';
import reasonRouter from './routes/reasonRoutes';
import articleRouter from './routes/articleRoutes';
import actionRouter from './routes/actionRoutes';
import checklistRouter from './routes/checklistRoutes';
import callRouter from './routes/callRoutes';
import validationRouter from './routes/validationRoutes';
import { generalLimiter } from './middleware/rateLimiters';



const app = express();
const prisma = new PrismaClient();

// ---- Global Middleware ----
app.use(helmet()); // Secure HTTP headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(generalLimiter);

// ---- Health Check Endpoint ----
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      db: 'down',
      message: (err as Error).message,
    });
  }
});

// ---- API Routes ----
app.use('/api/auth', authRouter);
app.use('/api/orgs', orgRouter);
app.use('/api/orgs/:orgId/agents', agentRouter);
app.use('/api/orgs/:orgId/members', memberRouter);
app.use('/api/orgs/:orgId/members', memberValidationRouter);
app.use('/api/orgs/:orgId/reasons', reasonRouter);
app.use('/api/orgs/:orgId/articles', articleRouter);
app.use('/api/orgs/:orgId/actions', actionRouter);
app.use('/api/orgs/:orgId/checklists', checklistRouter);
app.use('/api/orgs/:orgId/calls', callRouter);
app.use('/api/orgs/:orgId/validation-rules', validationRouter);

// ---- Global Error Handler ----
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;