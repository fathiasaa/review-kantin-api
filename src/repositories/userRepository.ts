import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export class UserRepository {
  async findAll() {
    const db = await getDb();

    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users);
  }

  async findById(id: number) {
    const db = await getDb();

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id));

    return rows[0];
  }

  
  async findByEmail(email: string) {
    const db = await getDb();

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.email, email));

    return rows[0];
  }


  async create(input: {
    name: string;
    email: string;
    passwordHash: string;
    role: 'admin' | 'owner' | 'customer';
  }) {
    const db = await getDb();

    const rows = await db
      .insert(users)
      .output({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .values({
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
      });

    return rows[0];
  }
}