import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes } from '../db/schema.ts';

export class LikeRepository {
  async create(input: {
    reviewId: number;
    userId: number;
  }) {
    const db = await getDb();

    const rows = await db
      .insert(likes)
      .output({
        id: likes.id,
        reviewId: likes.reviewId,
        userId: likes.userId,
        createdAt: likes.createdAt,
      })
      .values({
        reviewId: input.reviewId,
        userId: input.userId,
      });

    return rows[0];
  }

  async delete(id: number) {
    const db = await getDb();

    return db
      .delete(likes)
      .where(eq(likes.id, id));
  }
}