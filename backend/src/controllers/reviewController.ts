import type { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/reviewService.ts';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';

export class ReviewController {
  private reviewService: ReviewService;

  constructor(
    reviewService: ReviewService = new ReviewService(),
  ) {
    this.reviewService = reviewService;
  }

  getReviews = async (req: Request, res: Response): Promise<Response> => {
    try {
      const reviews = await this.reviewService.getReviews();

      return res.status(200).json({
        status: 'success',
        data: reviews,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data review',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  
  createReview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Ambil identitas pengguna dari JWT
      const user = res.locals.authUser;

      if (!user) {
        throw new UnauthorizedError('Autentikasi diperlukan');
      }

      // Ambil ID warung dari URL
      const stallId = Number(req.params.id);

      // Ambil rating dan comment dari hasil validasi Zod
      const input = res.locals.validated?.body ?? req.body;

      const review = await this.reviewService.createReview({
        stallId,
        userId: user.id,
        rating: input.rating,
        comment: input.comment,
      });

      res.status(201).json({
        status: 'success',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  };


  deleteReview = async (req: Request, res: Response): Promise<Response> => {
    try {
      const review = await this.reviewService.deleteReview(
        Number(req.params.id),
      );

      return res.status(200).json({
        status: 'success',
        message: 'Review berhasil dihapus',
        data: review,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus review',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}