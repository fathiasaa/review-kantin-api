
import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.ts';

export class AuthController {
  private authService = new AuthService();

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = res.locals.validated?.body ?? req.body;
      const user = await this.authService.register(input);

      res.status(201).json({
        status: 'success',
        message: 'Registrasi berhasil',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = res.locals.validated?.body ?? req.body;
      const result = await this.authService.login(input);

      res.status(200).json({
        status: 'success',
        message: 'Login berhasil',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = res.locals.authUser?.id;

      if (!userId) {
        res.status(401).json({
          status: 'fail',
          message: 'Autentikasi diperlukan',
        });
        return;
      }

      const user = await this.authService.getMe(userId);

      res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
