import { MenuItemRepository } from '../repositories/menuItemRepository.ts';

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

  async createMenuItem(input: {
    stallId: number;
    name: string;
    price: number;
    isAvailable: boolean;
  }) {
    return this.menuItemRepository.create(input);
  }

  async updateMenuItem(
    id: number,
    input: {
      stallId: number;
      name: string;
      price: number;
      isAvailable: boolean;
    },
  ) {
    const menuItem = await this.menuItemRepository.update(id, input);

    if (!menuItem) {
      throw new Error('MENU_ITEM_NOT_FOUND');
    }

    return menuItem;
  }

  async deleteMenuItem(id: number) {
  await this.menuItemRepository.delete(id);

  return {
    id,
  };
}
}