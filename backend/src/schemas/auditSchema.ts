import { z } from 'zod';

const tanggalSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, 'Tanggal tidak valid');

export const auditQuerySchema = z
  .object({
    userId: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    targetId: z.coerce
      .number()
      .int()
      .positive()
      .optional(),

    page: z.coerce
      .number()
      .int()
      .min(1, 'Page minimal 1')
      .default(1),

    pageSize: z.coerce
      .number()
      .int()
      .min(1, 'PageSize minimal 1')
      .max(100, 'PageSize maksimal 100')
      .default(20),

    action: z.string()
      .max(50, 'Action maksimal 50 karakter')
      .optional(),

    targetTable: z.string()
      .max(50, 'TargetTable maksimal 50 karakter')
      .optional(),

    from: tanggalSchema.optional(),

    to: tanggalSchema.optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (!data.from || !data.to) return true;
      return data.from <= data.to;
    },
    {
      message: 'Tanggal from tidak boleh lebih besar dari to',
      path: ['from'],
    }
  );