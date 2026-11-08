import type { Request, Response } from 'express';
import { AuditService } from '../services/auditService.ts';

export class AuditController {
  private auditService: AuditService;

  constructor(
    auditService: AuditService = new AuditService(),
  ) {
    this.auditService = auditService;
  }

  getAuditLogs = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const logs = await this.auditService.getAuditLogs();

      return res.status(200).json({
        status: 'success',
        data: logs,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil audit log',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  createAuditLog = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const log = await this.auditService.createAuditLog(req.body);

      return res.status(201).json({
        status: 'success',
        data: log,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal membuat audit log',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}