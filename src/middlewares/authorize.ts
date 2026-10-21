
import type { RequestHandler } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { ForbiddenError } from '../errors/ForbiddenError.ts';

type Role = 'admin' | 'owner' | 'customer';

export const authorize = (...allowedRoles: Role[]): RequestHandler => {
  return (req, res, next) => {
    const user = res.locals.authUser;

    if (!user) {
      return next(
        new UnauthorizedError('Autentikasi diperlukan')
      );
    }

    if (!allowedRoles.includes(user.role)) {
      return next(
        new ForbiddenError(
          'Role Anda tidak memiliki izin untuk melakukan tindakan ini'
        )
      );
    }

    next();
  };
};
