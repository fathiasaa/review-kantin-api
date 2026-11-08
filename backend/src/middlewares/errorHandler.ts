
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.ts';
import { ValidationError } from '../errors/ValidationError.ts';

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  // Error validasi langsung dari Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'fail',
      message: 'Validasi gagal',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  // Error validasi dari class ValidationError
  if (err instanceof ValidationError) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // Error aplikasi (401, 403, 404, dll.)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
    return;
  }

  // Error yang tidak terduga
  console.error(err);

  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
};
