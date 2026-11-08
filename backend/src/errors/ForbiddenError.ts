
import { AppError } from './AppError.ts';

export class ForbiddenError extends AppError {
  constructor(message = 'Anda tidak memiliki izin untuk mengakses endpoint ini') {
    super(403, message);
  }
}
