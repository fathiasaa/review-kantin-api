import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { authenticate } from '../middlewares/authenticate.ts';
import { authorize } from '../middlewares/authorize.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar review dengan nama user' }
  return reviewController.getReviews(req, res);
});


reviewRouter.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Review berhasil dihapus' }
    // #swagger.responses[401] = { description: 'Token JWT diperlukan' }
    // #swagger.responses[403] = { description: 'Hanya admin yang boleh menghapus review' }

    return reviewController.deleteReview(req, res);
  }
);


export { reviewRouter };