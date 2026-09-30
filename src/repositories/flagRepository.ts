import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags } from '../db/schema.ts';

export class FlagRepository {
  async findAll() {
    const db = await getDb();

    return db
      .select()
      .from(flags);
  }

  async updateStatus(id: number, status: string) {
    const db = await getDb();

    await db
      .update(flags)
      .set({ status })
      .where(eq(flags.id, id));

    const rows = await db
      .select()
      .from(flags)
      .where(eq(flags.id, id));

    return rows[0];
  }
}