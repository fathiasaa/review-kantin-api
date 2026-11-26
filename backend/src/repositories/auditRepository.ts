import {
  and,
  eq,
  desc,
  count,
  gte,
  lt,
  type SQL,
} from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs } from '../db/schema.ts';

export class AuditRepository {
  async findAll(filters?: {
    userId?: number;
    targetId?: number;
    page?: number;
    pageSize?: number;
    action?: string;
    targetTable?: string;
    from?: string;
    to?: string;
  }) {
    const db = await getDb();

    const conditions: SQL[] = [];

    if (filters?.userId !== undefined) {
      conditions.push(eq(auditLogs.userId, filters.userId));
    }

    if (filters?.targetId !== undefined) {
      conditions.push(eq(auditLogs.targetId, filters.targetId));
    }

    if (filters?.action !== undefined) {
      conditions.push(eq(auditLogs.action, filters.action));
    }

    if (filters?.targetTable !== undefined) {
      conditions.push(eq(auditLogs.targetTable, filters.targetTable));
    }

    if (filters?.from !== undefined) {
      const startDate = new Date(`${filters.from}T00:00:00.000Z`);

      conditions.push(gte(auditLogs.createdAt, startDate));
    }

    if (filters?.to !== undefined) {
      const endDateExclusive = new Date(`${filters.to}T00:00:00.000Z`);
      endDateExclusive.setUTCDate(endDateExclusive.getUTCDate() + 1);

      conditions.push(lt(auditLogs.createdAt, endDateExclusive));
    }

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const items = await db
      .select()
      .from(auditLogs)
      .where(whereCondition)
      .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id))
      .offset(offset)
      .fetch(pageSize);

    const totalResult = await db
      .select({ total: count() })
      .from(auditLogs)
      .where(whereCondition);

    const total = Number(totalResult[0]?.total ?? 0);
    const totalPages = Math.ceil(total / pageSize);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async findById(id: number) {
    const db = await getDb();

    const rows = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.id, id));

    return rows[0];
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