import express from 'express';
import jwt from 'jsonwebtoken';

type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  const token = header.slice('Bearer '.length);
  try {
    const jwtSecret = process.env.JWT_SECRET || 'devsecret_fallback_key';
    const decoded = jwt.verify(token, jwtSecret) as any;
    // Handle both old and new JWT structures
    const userId = decoded.userId || decoded.id;
    const userRole = decoded.role || 'producer'; // Default to producer for backward compatibility
    req.user = { id: userId, role: userRole };
    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function requireRole(allowed: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}


