
import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';
import { authenticate } from '../middlewares/authenticate.ts';

const menuItemRouter = Router();
const menuItemController = new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar menu' }
  return menuItemController.getMenuItems(req, res);
});

menuItemRouter.get('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail menu' }
  // #swagger.responses[404] = { description: 'Menu tidak ditemukan' }
  return menuItemController.getMenuItemById(req, res);
});

menuItemRouter.post('/', authenticate, (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', required: true }
  // #swagger.responses[201] = { description: 'Menu dibuat' }
  // #swagger.responses[401] = { description: 'Token tidak valid' }
  return menuItemController.createMenuItem(req, res);
});

menuItemRouter.put('/:id', authenticate, (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true }
  // #swagger.responses[200] = { description: 'Menu diubah' }
  // #swagger.responses[404] = { description: 'Menu tidak ditemukan' }
  return menuItemController.updateMenuItem(req, res);
});

menuItemRouter.delete('/:id', authenticate, (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Menu dihapus' }
  // #swagger.responses[404] = { description: 'Menu tidak ditemukan' }
  return menuItemController.deleteMenuItem(req, res);
});

export { menuItemRouter };
