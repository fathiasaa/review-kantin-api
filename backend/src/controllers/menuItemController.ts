
import type { Request, Response } from 'express';
import { MenuItemService } from '../services/menuItemService.ts';

export class MenuItemController {
  private menuItemService: MenuItemService;

  constructor(
    menuItemService: MenuItemService = new MenuItemService(),
  ) {
    this.menuItemService = menuItemService;
  }

  getMenuItems = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const menuItems = await this.menuItemService.getMenuItems();

      return res.status(200).json({
        status: 'success',
        data: menuItems,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data menu',
        error: error instanceof Error
          ? error.message
          : String(error),
      });
    }
  };

  getMenuItemById = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const menuItem = await this.menuItemService.getMenuItemById(
        Number(req.params.id),
      );

      return res.status(200).json({
        status: 'success',
        data: menuItem,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'MENU_ITEM_NOT_FOUND'
      ) {
        return res.status(404).json({
          status: 'fail',
          message: 'Data menu tidak ditemukan',
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data menu',
        error: error instanceof Error
          ? error.message
          : String(error),
      });
    }
  };

  createMenuItem = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const authUser = res.locals.authUser;

      if (!authUser) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
      }

      const menuItem = await this.menuItemService.createMenuItem(
        req.body,
        {
          userId: authUser.id,
          ipAddress: req.ip ?? '',
          userAgent: req.get('user-agent') ?? '',
        },
      );

      return res.status(201).json({
        status: 'success',
        data: menuItem,
      });
    } catch (error) {
      console.error('Create menu item error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan menu',
        error: error instanceof Error
          ? error.message
          : String(error),
      });
    }
  };

  updateMenuItem = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const authUser = res.locals.authUser;

      if (!authUser) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
      }

      const menuItem = await this.menuItemService.updateMenuItem(
        Number(req.params.id),
        req.body,
        {
          userId: authUser.id,
          ipAddress: req.ip ?? '',
          userAgent: req.get('user-agent') ?? '',
        },
      );

      return res.status(200).json({
        status: 'success',
        data: menuItem,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'MENU_ITEM_NOT_FOUND'
      ) {
        return res.status(404).json({
          status: 'fail',
          message: 'Data menu tidak ditemukan',
        });
      }

      console.error('Update menu item error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengubah data menu',
        error: error instanceof Error
          ? error.message
          : String(error),
      });
    }
  };

  deleteMenuItem = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const authUser = res.locals.authUser;

      if (!authUser) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized',
        });
      }

      const menuItem = await this.menuItemService.deleteMenuItem(
        Number(req.params.id),
        {
          userId: authUser.id,
          ipAddress: req.ip ?? '',
          userAgent: req.get('user-agent') ?? '',
        },
      );

      return res.status(200).json({
        status: 'success',
        message: 'Menu berhasil dihapus',
        data: menuItem,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'MENU_ITEM_NOT_FOUND'
      ) {
        return res.status(404).json({
          status: 'fail',
          message: 'Data menu tidak ditemukan',
        });
      }

      console.error('Delete menu item error:', error);

      return res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus data menu',
        error: error instanceof Error
          ? error.message
          : String(error),
      });
    }
  };
}
