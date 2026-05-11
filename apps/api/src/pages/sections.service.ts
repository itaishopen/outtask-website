import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';

@Injectable()
export class SectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private async assertPageExists(pageId: string): Promise<void> {
    const page = await this.prisma.page.findUnique({ where: { id: pageId } });
    if (!page) throw new NotFoundException(`Page ${pageId} not found`);
  }

  private async assertSectionExists(sectionId: string) {
    const section = await this.prisma.pageSection.findUnique({ where: { id: sectionId } });
    if (!section) throw new NotFoundException(`Section ${sectionId} not found`);
    return section;
  }

  async create(pageId: string, dto: CreateSectionDto, userId: string) {
    await this.assertPageExists(pageId);

    const section = await this.prisma.pageSection.create({
      data: {
        pageId,
        type: dto.type,
        order: dto.order,
        config: dto.config as Prisma.InputJsonValue,
      },
    });

    await this.audit.createLog(userId, 'CREATE', 'PageSection', section.id, {
      pageId,
      type: dto.type,
      order: dto.order,
    });

    return section;
  }

  async update(pageId: string, sectionId: string, dto: UpdateSectionDto, userId: string) {
    await this.assertPageExists(pageId);
    await this.assertSectionExists(sectionId);

    const section = await this.prisma.pageSection.update({
      where: { id: sectionId },
      data: {
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.config !== undefined && { config: dto.config as Prisma.InputJsonValue }),
      },
    });

    await this.audit.createLog(userId, 'UPDATE', 'PageSection', sectionId, dto as Record<string, unknown>);
    return section;
  }

  async remove(pageId: string, sectionId: string, userId: string) {
    await this.assertPageExists(pageId);
    await this.assertSectionExists(sectionId);

    await this.prisma.pageSection.delete({ where: { id: sectionId } });
    await this.audit.createLog(userId, 'DELETE', 'PageSection', sectionId, { pageId });
  }

  async reorder(pageId: string, dto: ReorderSectionsDto, userId: string) {
    await this.assertPageExists(pageId);

    await this.prisma.$transaction(
      dto.sectionIds.map((id, index) =>
        this.prisma.pageSection.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );

    const sections = await this.prisma.pageSection.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
    });

    await this.audit.createLog(userId, 'REORDER', 'PageSection', pageId, {
      order: dto.sectionIds,
    });

    return sections;
  }
}
