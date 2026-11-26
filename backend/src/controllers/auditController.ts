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
      const filters = res.locals.validated?.query ?? {};

      const logs = await this.auditService.getAuditLogs({
        userId: filters.userId,
        targetId: filters.targetId,
        page: filters.page,
        pageSize: filters.pageSize,
        action: filters.action,
        targetTable: filters.targetTable,
        from: filters.from,
        to: filters.to,
      });

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

  getAuditLogById = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      const log = await this.auditService.findAuditLogById(id);

      if (!log) {
        return res.status(404).json({
          status: 'error',
          message: 'Audit log tidak ditemukan',
        });
      }

      return res.status(200).json({
        status: 'success',
        data: log,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil detail audit log',
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