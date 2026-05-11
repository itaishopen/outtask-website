import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import slugify from 'slugify';
import { ContentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { JobProvider } from './job-provider.interface';
import { ManualProvider } from './providers/manual.provider';
import { RecruiteeProvider } from './providers/recruitee.provider';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly registry = new Map<string, JobProvider>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    manualProvider: ManualProvider,
    recruiteeProvider: RecruiteeProvider,
  ) {
    this.registry.set(manualProvider.name, manualProvider);
    this.registry.set(recruiteeProvider.name, recruiteeProvider);
  }

  // ── Provider Config CRUD ─────────────────────────────────────────────────────

  async findAllProviders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.jobProviderConfig.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.jobProviderConfig.count(),
    ]);
    return { data, total, page, limit };
  }

  async findOneProvider(id: string) {
    const config = await this.prisma.jobProviderConfig.findUnique({ where: { id } });
    if (!config) throw new NotFoundException(`Job provider config ${id} not found`);
    return config;
  }

  async createProvider(dto: CreateProviderDto, userId: string) {
    const config = await this.prisma.jobProviderConfig.create({
      data: {
        name: dto.name,
        type: dto.type,
        config: (dto.config ?? {}) as Prisma.InputJsonValue,
        enabled: dto.enabled ?? true,
      },
    });
    await this.audit.createLog(userId, 'CREATE', 'JobProviderConfig', config.id, { name: config.name, type: config.type });
    return config;
  }

  async updateProvider(id: string, dto: UpdateProviderDto, userId: string) {
    await this.findOneProvider(id);
    const config = await this.prisma.jobProviderConfig.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.config !== undefined && { config: dto.config as Prisma.InputJsonValue }),
        ...(dto.enabled !== undefined && { enabled: dto.enabled }),
      },
    });
    await this.audit.createLog(userId, 'UPDATE', 'JobProviderConfig', id, dto as Record<string, unknown>);
    return config;
  }

  async removeProvider(id: string, userId: string) {
    await this.findOneProvider(id);
    await this.prisma.jobProviderConfig.delete({ where: { id } });
    await this.audit.createLog(userId, 'DELETE', 'JobProviderConfig', id);
  }

  // ── Sync ─────────────────────────────────────────────────────────────────────

  async syncProvider(configId: string, userId?: string): Promise<{ upserted: number; errors: string[] }> {
    const providerConfig = await this.findOneProvider(configId);
    const provider = this.registry.get(providerConfig.type);

    if (!provider) {
      const msg = `No provider registered for type "${providerConfig.type}"`;
      this.logger.warn(msg);
      return { upserted: 0, errors: [msg] };
    }

    this.logger.log(`Syncing provider "${providerConfig.name}" (type: ${providerConfig.type})`);

    const configData = providerConfig.config as Record<string, unknown>;
    const jobs = await provider.fetchJobs(configData);
    const errors: string[] = [];
    let upserted = 0;

    for (const job of jobs) {
      try {
        const slug = job.slug ?? slugify(job.title, { lower: true, strict: true, trim: true });

        await this.prisma.vacancy.upsert({
          where: { externalId_providerId: { externalId: job.externalId, providerId: configId } },
          create: {
            title: job.title,
            slug,
            location: job.location,
            department: job.department,
            employmentType: job.employmentType,
            seniority: job.seniority,
            description: job.description,
            requirements: job.requirements,
            benefits: job.benefits,
            applyUrl: job.applyUrl,
            externalId: job.externalId,
            providerId: configId,
            status: ContentStatus.PUBLISHED,
          },
          update: {
            title: job.title,
            location: job.location,
            department: job.department,
            employmentType: job.employmentType,
            seniority: job.seniority,
            description: job.description,
            requirements: job.requirements,
            benefits: job.benefits,
            applyUrl: job.applyUrl,
          },
        });
        upserted++;
      } catch (error) {
        const msg = `Failed to upsert job "${job.title}" (${job.externalId}): ${String(error)}`;
        this.logger.error(msg);
        errors.push(msg);
      }
    }

    await this.prisma.jobProviderConfig.update({
      where: { id: configId },
      data: { lastSyncAt: new Date() },
    });

    if (userId) {
      await this.audit.createLog(userId, 'SYNC', 'JobProviderConfig', configId, {
        provider: providerConfig.name,
        upserted,
        errors: errors.length,
      });
    }

    this.logger.log(`Sync complete for "${providerConfig.name}": ${upserted} upserted, ${errors.length} errors`);
    return { upserted, errors };
  }

  @Cron('0 */6 * * *')
  async syncAll(userId?: string): Promise<void> {
    this.logger.log('Starting scheduled sync of all job providers');
    const configs = await this.prisma.jobProviderConfig.findMany({ where: { enabled: true } });

    for (const config of configs) {
      try {
        await this.syncProvider(config.id, userId);
      } catch (error) {
        this.logger.error(`Sync failed for provider "${config.name}": ${String(error)}`);
      }
    }
  }
}
