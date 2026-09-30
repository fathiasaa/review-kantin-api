import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true }
  // #swagger.responses[201] = { description: 'Like dibuat' }
  return likeController.createLike(req, res);
});

likeRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Like dihapus' }
  return likeController.deleteLike(req, res);
});

export { likeRouter };