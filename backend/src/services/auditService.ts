import { AuditRepository } from '../repositories/auditRepository.ts';

export class AuditService {
  private auditRepository: AuditRepository;

  constructor(
    auditRepository: AuditRepository = new AuditRepository(),
  ) {
    this.auditRepository = auditRepository;
  }

  async getAuditLogs(filters?: {
    userId?: number;
    targetId?: number;
    page?: number;
    pageSize?: number;
    action?: string;
    targetTable?: string;
    from?: string;
    to?: string;
  }) {
    return this.auditRepository.findAll(filters);
  }

  async findAuditLogById(id: number) {
    return this.auditRepository.findById(id);
  }

  async createAuditLog(input: {
    userId: number;
    action: string;
    targetTable: string;
    targetId: number;
    metadata: string;
  }) {
    return this.auditRepository.create(input);
  }
}