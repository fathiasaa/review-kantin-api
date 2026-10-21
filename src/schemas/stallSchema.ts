
import { z } from 'zod';

// Validasi query GET /stalls
export const getStallsSchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(50).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Validasi parameter ID warung
export const stallIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Validasi POST /stalls
export const createStallSchema = z.object({
  name: z.string().trim().min(3).max(100),
  category: z.string().trim().max(50).optional(),
  location: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
});

// Validasi PUT /stalls/:id
export const updateStallSchema = createStallSchema.partial();
