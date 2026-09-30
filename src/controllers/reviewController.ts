import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';

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

  createReview = async (req: Request, res: Response): Promise<Response> => {
    try {
      const review = await this.reviewService.createReview(req.body);

      return res.status(201).json({
        status: 'success',
        data: review,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal membuat review',
        error: error instanceof Error ? error.message : String(error),
      });
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