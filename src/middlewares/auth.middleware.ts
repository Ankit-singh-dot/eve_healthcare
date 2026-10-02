import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import prisma from '../utils/prisma.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1] as any;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Malformed token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
