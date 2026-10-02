import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
import logger from '../config/logger.js';

export const validate = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      logger.error('Validation error', error.errors);
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
  };
};
