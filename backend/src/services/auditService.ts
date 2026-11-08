import { AuditRepository } from '../repositories/auditRepository.ts';

export class AuditService {
  private auditRepository: AuditRepository;

  constructor(
    auditRepository: AuditRepository = new AuditRepository(),
  ) {
    this.auditRepository = auditRepository;
  }

  async getAuditLogs() {
    return this.auditRepository.findAll();
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