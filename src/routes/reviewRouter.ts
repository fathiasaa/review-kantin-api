import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar review dengan nama user' }
  return reviewController.getReviews(req, res);
});

reviewRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true }
  // #swagger.responses[201] = { description: 'Review dibuat' }
  return reviewController.createReview(req, res);
});

reviewRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Review dihapus' }
  return reviewController.deleteReview(req, res);
});

export { reviewRouter };