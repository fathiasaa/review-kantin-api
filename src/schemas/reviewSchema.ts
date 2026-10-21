
import { z } from 'zod';

// Validasi body POST /stalls/:id/reviews
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});
