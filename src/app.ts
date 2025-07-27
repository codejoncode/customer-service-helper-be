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
import faqRouter from './routes/faqRoutes';
import callSummaryRouter from './routes/callSummaryRoutes';
import escalationRouter from './routes/escalationRoutes';
import trainingRouter from './routes/trainingRoutes';
import bugRouter from './routes/bugRoutes';
import { generalLimiter } from './middleware/rateLimiters';
import importJobRoutes from './routes/importJobRoutes';
import auth from './middleware/auth';

const app = express();
const prisma = new PrismaClient();
const xssClean = require('xss-clean');

// ---- Global Middleware ----
app.use(helmet());

if (process.env.NODE_ENV === 'production') {
  app.use(xssClean());
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

app.use(express.json({ limit: '10kb' }));

// catch invalid JSON right away
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next(err);
});

// catch invalid JSON payloads
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next(err);
});

app.use(generalLimiter);

// ---- Health Check ----
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$connect();
    await prisma.$disconnect();
    res.status(200).json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'down', message: (err as Error).message });
  }
});

// everything below requires valid token
app.use('/api', auth);

// ---- Public API Routes ----
app.use('/api/auth', authRouter);
app.use('/api/orgs', orgRouter);

// scoped org routes
app.use('/api/orgs/:orgId/agents', agentRouter);
app.use('/api/orgs/:orgId/members', memberRouter);
app.use('/api/orgs/:orgId/members', memberValidationRouter);
app.use('/api/orgs/:orgId/reasons', reasonRouter);
app.use('/api/orgs/:orgId/articles', articleRouter);
app.use('/api/orgs/:orgId/actions', actionRouter);
app.use('/api/orgs/:orgId/checklist', checklistRouter);
app.use('/api/orgs/:orgId/calls', callRouter);
app.use('/api/orgs/:orgId/validation-rules', validationRouter);

app.use('/api/orgs/:orgId/faqs', faqRouter);

// call summaries should live at /summary per tests
app.use('/api/orgs/:orgId/summary', callSummaryRouter);
app.use('/api/orgs/:orgId/call-summaries', callSummaryRouter);

app.use('/api/orgs/:orgId/escalations', escalationRouter);
app.use('/api/orgs/:orgId/training', trainingRouter);
app.use('/api/orgs/:orgId/bugs', bugRouter);
app.use('/api/orgs/:orgId/import-jobs', importJobRoutes);

// ---- Global Error Handler ----
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
