import type { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';

export class FlagController {
  private flagService: FlagService;

  constructor(
    flagService: FlagService = new FlagService(),
  ) {
    this.flagService = flagService;
  }

  getFlags = async (req: Request, res: Response): Promise<Response> => {
    try {
      const flags = await this.flagService.getFlags();

      return res.status(200).json({
        status: 'success',
        data: flags,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data flag',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  updateFlagStatus = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const flag = await this.flagService.updateFlagStatus(
        Number(req.params.id),
        req.body.status,
      );

      return res.status(200).json({
        status: 'success',
        data: flag,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'FLAG_NOT_FOUND'
      ) {
        return res.status(404).json({
          status: 'fail',
          message: 'Data flag tidak ditemukan',
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengubah status flag',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}