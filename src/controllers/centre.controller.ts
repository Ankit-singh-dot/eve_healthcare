import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import * as centreService from '../services/centre.service.js';
import redisClient from '../utils/redis.js';
import logger from '../config/logger.js';

export const createCentre = async (req: Request, res: Response) => {
  try {
    const centre = await centreService.createCentre(req.body);
    res.status(201).json(centre);
  } catch (error: any) {
    logger.error('Error creating centre', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getCentres = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const centres = await centreService.getCentres(page, limit);
    res.status(200).json(centres);
  } catch (error: any) {
    logger.error('Error fetching centres', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTest = async (req: Request, res: Response) => {
  try {
    const test = await centreService.createTest(req.body);
    res.status(201).json(test);
  } catch (error: any) {
    logger.error('Error creating test', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTests = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tests = await centreService.getTests(page, limit);
    res.status(200).json(tests);
  } catch (error: any) {
    logger.error('Error fetching tests', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addTestToCentre = async (req: Request, res: Response) => {
  try {
    const centreId = req.params.centreId as string;
    const { testId, price } = req.body;
    const centreTest = await centreService.addTestToCentre(centreId, testId, price);
    res.status(201).json(centreTest);
  } catch (error: any) {
    logger.error('Error adding test to centre', error);
    if (error.code === 'P2002') { // Prisma unique constraint violation
      return res.status(409).json({ error: 'Test already added to this centre' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
