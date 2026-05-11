import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createLog(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    changes?: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          changes: changes as Prisma.InputJsonValue ?? undefined,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to write audit log: ${String(error)}`);
    }
  }
}
