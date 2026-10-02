import prisma from '../utils/prisma.js';
import redisClient from "../utils/redis.js"; 
export const createCentre = async (data: { name: string; location: string }) => {
  return prisma.diagnosticCentre.create({
    data
  });
};

export const getCentres = async (page: number = 1, limit: number = 10) => {
  const cacheKey = `centres:page:${page}:limit:${limit}`;

  // 1. Check if data exists in Redis (CACHE HIT)
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // 2. If not in Redis, fetch from Database (CACHE MISS)
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.diagnosticCentre.findMany({
      skip,
      take: limit,
      include: { tests: { include: { test: true } } },
    }),
    prisma.diagnosticCentre.count(),
  ]);

  const response = {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };

  // 3. Store the result in Redis for 60 seconds (TTL)
  await redisClient.setEx(cacheKey, 60, JSON.stringify(response));

  return response;
};


export const createTest = async (data: { name: string; description?: string }) => {
  return prisma.diagnosticTest.create({
    data
  });
};

export const getTests = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.diagnosticTest.findMany({
      skip,
      take: limit
    }),
    prisma.diagnosticTest.count()
  ]);

  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const addTestToCentre = async (centreId: string, testId: string, price: number) => {
  return prisma.centreTest.create({
    data: {
      centreId,
      testId,
      price
    }
  });
};
