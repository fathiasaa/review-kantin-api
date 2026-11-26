import { MenuItemRepository } from '../repositories/menuItemRepository.ts';
import { getDb } from '../db/index.ts';
import { auditLogs } from '../db/schema.ts';

interface MenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

interface AuditContext {
  userId: number;
  ipAddress: string;
  userAgent: string;
}

export class MenuItemService {
  private menuItemRepository: MenuItemRepository;

  constructor(
    menuItemRepository: MenuItemRepository = new MenuItemRepository(),
  ) {
    this.menuItemRepository = menuItemRepository;
  }

  async getMenuItems() {
    return this.menuItemRepository.findAll();
  }

  async getMenuItemById(id: number) {
    const menuItem = await this.menuItemRepository.findById(id);

    if (!menuItem) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return menuItem;
  }

  async createMenuItem(
    input: MenuItemInput,
    auditContext: AuditContext,
  ) {
    const db = await getDb();

    return db.transaction(async (tx) => {
      const menuItem = await this.menuItemRepository.create(input, tx);

      if (!menuItem) {
        throw new Error('MENU_ITEM_CREATE_FAILED');
      }

      await tx.insert(auditLogs).values({
        userId: auditContext.userId,
        action: 'CREATE_MENU',
        targetTable: 'MENU_ITEMS',
        targetId: menuItem.id,
        metadata: JSON.stringify({
          after: menuItem,
          ip_address: auditContext.ipAddress,
          user_agent: auditContext.userAgent,
        }),
      });

      return menuItem;
    });
  }

  async updateMenuItem(
    id: number,
    input: MenuItemInput,
    auditContext: AuditContext,
  ) {
    const db = await getDb();

    return db.transaction(async (tx) => {
      const before = await this.menuItemRepository.findById(id, tx);

      if (!before) {
        throw new Error('MENU_ITEM_NOT_FOUND');
      }

      const after = await this.menuItemRepository.update(id, input, tx);

      if (!after) {
        throw new Error('MENU_ITEM_UPDATE_FAILED');
      }

      await tx.insert(auditLogs).values({
        userId: auditContext.userId,
        action: 'UPDATE_MENU',
        targetTable: 'MENU_ITEMS',
        targetId: id,
        metadata: JSON.stringify({
          before,
          after,
          ip_address: auditContext.ipAddress,
          user_agent: auditContext.userAgent,
        }),
      });

      return after;
    });
  }

  async deleteMenuItem(
    id: number,
    auditContext: AuditContext,
  ) {
    const db = await getDb();

    return db.transaction(async (tx) => {
      const before = await this.menuItemRepository.findById(id, tx);

      if (!before) {
        throw new Error('MENU_ITEM_NOT_FOUND');
      }

      await this.menuItemRepository.delete(id, tx);

      await tx.insert(auditLogs).values({
        userId: auditContext.userId,
        action: 'DELETE_MENU',
        targetTable: 'MENU_ITEMS',
        targetId: id,
        metadata: JSON.stringify({
          before,
          ip_address: auditContext.ipAddress,
          user_agent: auditContext.userAgent,
        }),
      });

      return { id };
    });
  }
}