import jwt from 'jsonwebtoken';

// Pull this from your .env (ensure .env.test has one too)
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

export interface JwtPayload {
  userId: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER';
  // any other fields you want encoded
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h', // or whatever makes sense
    algorithm: 'HS256',
  });
}
