import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, users } from '../db/schema.ts';

export class ReviewRepository {
  async findAll() {
    const db = await getDb();

    return db
      .select({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
        userName: users.name,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id));
  }

  async create(input: {
    stallId: number;
    userId: number;
    rating: number;
    comment: string;
  }) {
    const db = await getDb();

    const rows = await db
      .insert(reviews)
      .output({
        id: reviews.id,
        stallId: reviews.stallId,
        userId: reviews.userId,
        rating: reviews.rating,
        comment: reviews.comment,
        likeCount: reviews.likeCount,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
      })
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment,
        likeCount: 0,
      });

    return rows[0];
  }

  async delete(id: number) {
    const db = await getDb();

    return db
      .delete(reviews)
      .where(eq(reviews.id, id));
  }
}