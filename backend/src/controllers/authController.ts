
import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import { AuthService } from '../services/authService.ts';
import { AuditService } from '../services/auditService.ts';

export class AuthController {
  private authService = new AuthService();
  private auditService = new AuditService();

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

      // Audit LOGIN bersifat best-effort.
      // Jika gagal, login tetap berhasil.
      try {
        await this.auditService.createAuditLog({
          userId: result.auditUser.id,
          action: 'LOGIN',
          targetTable: 'USERS',
          targetId: result.auditUser.id,
          metadata: JSON.stringify({
            role: result.auditUser.role,
            ip_address:
              req.ip ?? req.socket.remoteAddress ?? 'unknown',
            user_agent:
              req.get('user-agent') ?? 'unknown',
            result: 'success',
          }),
        });
      } catch (auditError) {
        console.error(
          'Gagal mencatat audit LOGIN:',
          auditError
        );
      }

      res.status(200).json({
        status: 'success',
        message: 'Login berhasil',
        data: {
          token: result.token,
          tokenType: result.tokenType,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.authUser;

    if (!user?.id) {
      res.status(401).json({
        status: 'error',
        message: 'User tidak terautentikasi',
      });
      return;
    }

    // Audit LOGOUT
    try {
      await this.auditService.createAuditLog({
        userId: user.id,
        action: 'LOGOUT',
        targetTable: 'USERS',
        targetId: user.id,
        metadata: JSON.stringify({
          role: user.role,
          ip_address: req.ip ?? req.socket.remoteAddress ?? 'unknown',
          user_agent: req.get('user-agent') ?? 'unknown',
          result: 'success',
        }),
      });
    } catch (auditError) {
      console.error('Gagal mencatat audit LOGOUT:', auditError);
    }

    res.status(200).json({
      status: 'success',
      message: 'Logout berhasil',
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
