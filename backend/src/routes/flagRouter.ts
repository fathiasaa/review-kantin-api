import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();
const flagController = new FlagController();

flagRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar flags' }
  return flagController.getFlags(req, res);
});

flagRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true }
  // #swagger.responses[200] = { description: 'Status flag diubah' }
  // #swagger.responses[404] = { description: 'Flag tidak ditemukan' }
  return flagController.updateFlagStatus(req, res);
});

export { flagRouter };