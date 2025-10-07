import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.AUTH0_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  username?: string;
  fullname?: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify JWT token from Authorization header
 * @param request NextRequest object
 * @returns Decoded JWT payload or null if invalid
 */
export function verifyMobileToken(request: NextRequest): JWTPayload | null {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Extract user ID from JWT token
 * @param request NextRequest object
 * @returns User ID or null if invalid
 */
export function getUserIdFromToken(request: NextRequest): string | null {
  const payload = verifyMobileToken(request);
  return payload?.id || null;
}

/**
 * Check if user has required role
 * @param request NextRequest object
 * @param allowedRoles Array of allowed roles
 * @returns Boolean indicating if user has required role
 */
export function hasRequiredRole(request: NextRequest, allowedRoles: string[]): boolean {
  const payload = verifyMobileToken(request);
  
  if (!payload || !payload.role) {
    return false;
  }
  
  return allowedRoles.includes(payload.role);
}

/**
 * Generate error response for unauthorized requests
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return {
    success: false,
    message,
  };
}

