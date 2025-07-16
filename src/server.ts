// src/server.ts
import 'dotenv/config'                        // load .env into process.env
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { PrismaClient } from '@prisma/client'

import authRouter from './routes/authRoutes'
import orgRouter from './routes/orgRoutes'
import agentRouter from './routes/agentRoutes'

const app = express()
const prisma = new PrismaClient()

// ---- Global Middleware ----
app.use(helmet())                            // secure HTTP headers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET','POST','PUT','DELETE','OPTIONS']
  })
)
app.use(express.json())                      // parse JSON bodies

// ---- Health Check Endpoint ----
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$connect()
    await prisma.$disconnect()
    res.status(200).json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res
      .status(500)
      .json({ status: 'error', db: 'down', message: (err as Error).message })
  }
})

// ---- API Routes ----
app.use('/api/auth', authRouter)
app.use('/api/orgs', orgRouter)
// agentRouter is mounted under /api/orgs/:orgId/agents
app.use('/api/orgs/:orgId/agents', agentRouter)

// ---- Global Error Handler ----
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Error:', err)
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
)

// ---- Start Server ----
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})