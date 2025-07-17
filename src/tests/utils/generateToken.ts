import jwt from 'jsonwebtoken'

export type TestRole = "ADMIN" | "MANAGER" | "AGENT"

export interface TestUserPayload {
  userId: string
  role: string
  orgId: string
}

export function generateTestJWT(payload: TestUserPayload): string {
  const secret = process.env.JWT_SECRET || 'test-secret'
  return jwt.sign(payload, secret, { expiresIn: '1h' })
}