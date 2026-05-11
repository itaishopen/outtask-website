import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { Roles } from '../common/decorators/roles.decorator';

class AuditLogQueryDto {
  page?: number;
  limit?: number;
  entity?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

@ApiTags('Audit')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin/audit-log')
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List audit log entries (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'entity', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  async findAll(@Query() query: AuditLogQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.entity) where['entity'] = query.entity;
    if (query.userId) where['userId'] = query.userId;
    if (query.dateFrom || query.dateTo) {
      where['createdAt'] = {};
      if (query.dateFrom) (where['createdAt'] as Record<string, unknown>)['gte'] = new Date(query.dateFrom);
      if (query.dateTo) (where['createdAt'] as Record<string, unknown>)['lte'] = new Date(query.dateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}
