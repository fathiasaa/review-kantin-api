
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token JWT diperlukan'));
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return next(new UnauthorizedError('Token JWT diperlukan'));
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new Error('JWT_SECRET belum dikonfigurasi'));
  }

  try {
    const payload = jwt.verify(token, secret);

    if (
      typeof payload === 'string' ||
      !payload.sub ||
      typeof payload.role !== 'string' ||
      !['admin', 'owner', 'customer'].includes(payload.role)
    ) {
      throw new UnauthorizedError('Token JWT tidak valid');
    }

    const id = Number(payload.sub);

    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new UnauthorizedError('Token JWT tidak valid');
    }

    res.locals.authUser = {
      id,
      role: payload.role,
    };

    next();
  } catch {
    next(new UnauthorizedError('Token JWT tidak valid atau kedaluwarsa'));
  }
};
