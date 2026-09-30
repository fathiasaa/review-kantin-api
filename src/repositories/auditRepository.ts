import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs } from '../db/schema.ts';

export class AuditRepository {
  async findAll() {
    const db = await getDb();

    return db
      .select()
      .from(auditLogs);
  }

  async create(input: {
    userId: number;
    action: string;
    targetTable: string;
    targetId: number;
    metadata: string;
  }) {
    const db = await getDb();

    const rows = await db
      .insert(auditLogs)
      .output({
        id: auditLogs.id,
        userId: auditLogs.userId,
        action: auditLogs.action,
        targetTable: auditLogs.targetTable,
        targetId: auditLogs.targetId,
        metadata: auditLogs.metadata,
        createdAt: auditLogs.createdAt,
      })
      .values({
        userId: input.userId,
        action: input.action,
        targetTable: input.targetTable,
        targetId: input.targetId,
        metadata: input.metadata,
      });

    return rows[0];
  }
}