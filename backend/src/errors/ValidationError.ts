
import { AppError } from './AppError.ts';

export interface ValidationIssue {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  constructor(
    public errors: ValidationIssue[],
    message = 'Validasi gagal',
  ) {
    super(400, message);
  }
}
