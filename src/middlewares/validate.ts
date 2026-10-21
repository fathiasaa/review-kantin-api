
import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ValidationError } from '../errors/ValidationError.ts';

type BagianRequest = 'body' | 'query' | 'params';

export const validate = (
  schema: z.ZodType,
  bagian: BagianRequest = 'body'
): RequestHandler => {
  return (req, res, next) => {
    const hasil = schema.safeParse(req[bagian]);

    if (!hasil.success) {
      const errors = hasil.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return next(new ValidationError(errors));
    }

    // Simpan data hasil validasi untuk digunakan controller.
    // Tidak mengubah req.query atau req.params secara langsung.
    res.locals.validated ??= {};
    res.locals.validated[bagian] = hasil.data;

    next();
  };
};
