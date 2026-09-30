import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems } from '../db/schema.ts';

export class MenuItemRepository {
  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select().from(menuItems).where(eq(menuItems.stallId, stallId));
  }

  async findAll() {
    const db = await getDb();
    return db.select().from(menuItems);
  }

  async findById(id: number) {
    const db = await getDb();

    const rows = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id));

    return rows[0];
  }
  async create(input: {
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}) {
  const db = await getDb();

  const rows = await db
    .insert(menuItems)
    .output({
      id: menuItems.id,
      stallId: menuItems.stallId,
      name: menuItems.name,
      price: menuItems.price,
      isAvailable: menuItems.isAvailable,
    })
    .values(input);

  return rows[0];
}
  async update(
  id: number,
  input: {
    stallId: number;
    name: string;
    price: number;
    isAvailable: boolean;
  },
) {
  const db = await getDb();

  await db
    .update(menuItems)
    .set(input)
    .where(eq(menuItems.id, id));

  return this.findById(id);
}
  async delete(id: number) {
  const db = await getDb();

  const result = await db
    .delete(menuItems)
    .where(eq(menuItems.id, id));

  return result;
}
}