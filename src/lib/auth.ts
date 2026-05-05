import { jwtVerify, jwtSign } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface TokenPayload {
  id: string;
  email: string;
  role: 'customer' | 'provider';
  iat?: number;
  exp?: number;
}

/**
 * Create JWT token
 */
export async function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>) {
  return await jwtSign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwtVerify(token, JWT_SECRET);
    return decoded.payload as TokenPayload;
  } catch (error) {
    return null;
  }
}
