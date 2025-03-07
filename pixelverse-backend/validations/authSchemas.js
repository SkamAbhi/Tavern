import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});