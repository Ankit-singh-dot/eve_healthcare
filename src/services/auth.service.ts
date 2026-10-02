import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

export const signup = async (data: any) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name
    }
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecretjwtkey_replace_me_in_production', { expiresIn: '24h' });
  return { user: { id: user.id, email: user.email, name: user.name }, token };
};

export const login = async (data: any) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'supersecretjwtkey_replace_me_in_production', { expiresIn: '24h' });
  return { user: { id: user.id, email: user.email, name: user.name }, token };
};
