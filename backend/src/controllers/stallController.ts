import type { Request, Response } from 'express';
import { StallService } from '../services/stallService.ts';
import { ForbiddenError } from '../errors/ForbiddenError.ts';

export class StallController {
  private stallService: StallService;

  constructor(stallService: StallService = new StallService()) {
    this.stallService = stallService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'STALL_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Data warung tidak ditemukan' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

 
  getStalls = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
      } = (res.locals.validated?.query ?? {}) as {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
      };

      const { data, total } = await this.stallService.getAllStalls({
        search,
        category,
        page,
        limit,
      });

      return res.status(200).json({
        status: 'success',
        meta: { page, limit, total },
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };


  getStallById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.getStallById(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getStallMenus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const menus = await this.stallService.getStallMenus(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: menus });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  
  createStall = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      // Identitas pengguna dari JWT
      const user = res.locals.authUser;

      // Data warung yang sudah divalidasi Zod
      const input = res.locals.validated?.body ?? req.body;

      // Owner ID ditentukan server, bukan pengguna
      const stall = await this.stallService.createStall({
        ...input,
        ownerId: user.id,
      });

      return res.status(201).json({
        status: 'success',
        data: stall,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };


  
  updateStall = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const stallId = Number(req.params.id);
      const user = res.locals.authUser;

      // Ambil data warung dari database
      const stall = await this.stallService.getStallById(stallId);

      // Owner hanya boleh mengedit warung miliknya
      if (
        user.role !== 'admin' &&
        Number(stall.ownerId) !== user.id
      ) {
        throw new ForbiddenError(
          'Anda hanya boleh mengedit warung milik sendiri'
        );
      }

      // Gunakan data yang sudah divalidasi Zod
      const input = res.locals.validated?.body ?? req.body;

      const updatedStall = await this.stallService.updateStall(
        stallId,
        input
      );

      return res.status(200).json({
        status: 'success',
        data: updatedStall,
      });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return res.status(403).json({
          status: 'fail',
          message: error.message,
        });
      }

      return this.handleError(res, error);
    }
  };


  deleteStall = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.deleteStall(Number(req.params.id));
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}
