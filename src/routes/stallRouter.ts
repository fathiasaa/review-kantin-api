import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { validate } from '../middlewares/validate.ts';
import {
  getStallsSchema,
  stallIdSchema,
  createStallSchema,
  updateStallSchema,
} from '../schemas/stallSchema.ts';
import { authenticate } from '../middlewares/authenticate.ts';
import { authorize } from '../middlewares/authorize.ts';
import { ReviewController } from '../controllers/reviewController.ts';
import { createReviewSchema } from '../schemas/reviewSchema.ts';

const stallRouter = Router();
const stallController = new StallController();
const reviewController = new ReviewController();

stallRouter.get('/', validate(getStallsSchema, 'query'), (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  return stallController.getStalls(req, res);
});

stallRouter.post(
  '/',
  validate(createStallSchema, 'body'),
  authenticate,
  authorize('admin', 'owner'),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
    // #swagger.responses[201] = { description: 'Warung dibuat' }
    // #swagger.responses[401] = { description: 'Token JWT diperlukan' }
    // #swagger.responses[403] = { description: 'Akses ditolak karena role tidak sesuai' }

    return stallController.createStall(req, res);
  }
);

stallRouter.get('/:id', validate(stallIdSchema, 'params'), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.put(
  '/:id',
  validate(stallIdSchema, 'params'),
  validate(updateStallSchema, 'body'),
  authenticate,
  authorize('admin', 'owner'),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
    // #swagger.responses[200] = { description: 'Warung ter-update' }
    // #swagger.responses[401] = { description: 'Token JWT diperlukan atau tidak valid' }
    // #swagger.responses[403] = { description: 'Akses ditolak' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }

    return stallController.updateStall(req, res);
  }
);

stallRouter.delete(
  '/:id',
  validate(stallIdSchema, 'params'),
  authenticate,
  authorize('admin'),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Warung terhapus' }
    // #swagger.responses[401] = { description: 'Token JWT diperlukan atau tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin yang boleh menghapus warung' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }

    return stallController.deleteStall(req, res);
  }
);

stallRouter.get('/:id/menus', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});


stallRouter.post(
  '/:id/reviews',
  validate(stallIdSchema, 'params'),
  validate(createReviewSchema, 'body'),
  authenticate,
  (req, res, next) => {
    // #swagger.tags = ['Reviews']
    // #swagger.summary = 'Membuat review warung'
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    /* #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $rating: 5,
        comment: 'Makanannya enak'
      }
    } */
    // #swagger.responses[201] = { description: 'Review berhasil dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token JWT diperlukan' }

    return reviewController.createReview(req, res, next);
  }
);


export { stallRouter };
