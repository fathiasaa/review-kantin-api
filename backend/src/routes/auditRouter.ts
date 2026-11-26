import { Router } from 'express';
import { AuditController } from '../controllers/auditController.ts';
import { authenticate } from '../middlewares/authenticate.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { auditQuerySchema } from '../schemas/auditSchema.ts';

const auditRouter = Router();
const auditController = new AuditController();

// Semua endpoint audit hanya untuk Admin
auditRouter.use(authenticate);
auditRouter.use(authorize('admin'));

// GET daftar audit log
auditRouter.get(
  '/',
  validate(auditQuerySchema, 'query'),
  (req, res) => {
  // #swagger.tags = ['Audit Logs']
  // #swagger.summary = 'Menampilkan daftar audit log'
  // #swagger.parameters['userId'] = { in: 'query', type: 'integer', required: false, description: 'Filter berdasarkan user ID' }
  // #swagger.parameters['targetId'] = { in: 'query', type: 'integer', required: false, description: 'Filter berdasarkan target ID' }
  // #swagger.parameters['action'] = { in: 'query', type: 'string', required: false, description: 'Filter berdasarkan action (LOGIN, LOGOUT, CREATE_MENU, UPDATE_MENU, DELETE_MENU)' }
  // #swagger.parameters['targetTable'] = { in: 'query', type: 'string', required: false, description: 'Filter berdasarkan nama tabel' }
  // #swagger.parameters['from'] = { in: 'query', type: 'string', required: false, description: 'Tanggal mulai (YYYY-MM-DD)' }
  // #swagger.parameters['to'] = { in: 'query', type: 'string', required: false, description: 'Tanggal akhir (YYYY-MM-DD)' }
  // #swagger.parameters['page'] = { in: 'query', type: 'integer', required: false, description: 'Nomor halaman', default: 1 }
  // #swagger.parameters['pageSize'] = { in: 'query', type: 'integer', required: false, description: 'Jumlah data per halaman (maksimal 100)', default: 20 }
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Daftar audit log' }
  // #swagger.responses[401] = { description: 'Token tidak valid atau tidak tersedia' }
  // #swagger.responses[403] = { description: 'Akses hanya untuk Admin' }

  return auditController.getAuditLogs(req, res);
});

// GET detail audit log berdasarkan ID
auditRouter.get('/:id', (req, res) => {
  // #swagger.tags = ['Audit Logs']
  // #swagger.summary = 'Menampilkan detail audit log berdasarkan ID'
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Detail audit log ditemukan' }
  // #swagger.responses[404] = { description: 'Audit log tidak ditemukan' }

  return auditController.getAuditLogById(req, res);
});

export { auditRouter };