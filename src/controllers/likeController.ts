import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  private likeService: LikeService;

  constructor(
    likeService: LikeService = new LikeService(),
  ) {
    this.likeService = likeService;
  }

  createLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.likeService.createLike(req.body);

      return res.status(201).json({
        status: 'success',
        data: like,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan like',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  deleteLike = async (req: Request, res: Response): Promise<Response> => {
    try {
      const like = await this.likeService.deleteLike(
        Number(req.params.id),
      );

      return res.status(200).json({
        status: 'success',
        message: 'Like berhasil dihapus',
        data: like,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus like',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}