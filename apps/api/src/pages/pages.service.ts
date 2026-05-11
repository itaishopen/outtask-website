import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, trim: true });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.page.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { sections: { orderBy: { order: 'asc' } } },
      }),
      this.prisma.page.count(),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    if (!page) throw new NotFoundException(`Page ${id} not found`);
    return page;
  }

  async create(dto: CreatePageDto, userId: string) {
    const slug = dto.slug ?? this.generateSlug(dto.title);

    const existing = await this.prisma.page.findUnique({ where: { slug } });
    if (existing) throw new ConflictException(`Slug "${slug}" is already in use`);

    const page = await this.prisma.page.create({
      data: {
        title: dto.title,
        slug,
        locale: dto.locale ?? 'en',
        status: dto.status,
        seoTitle: dto.seoTitle,
        seoDesc: dto.seoDesc,
        ogImage: dto.ogImage,
      },
      include: { sections: true },
    });

    await this.audit.createLog(userId, 'CREATE', 'Page', page.id, { title: page.title, slug: page.slug });
    return page;
  }

  async update(id: string, dto: UpdatePageDto, userId: string) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.page.findUnique({ where: { slug: dto.slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Slug "${dto.slug}" is already in use`);
      }
    }

    const slug = dto.title && !dto.slug ? this.generateSlug(dto.title) : dto.slug;

    const page = await this.prisma.page.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(slug !== undefined && { slug }),
        ...(dto.locale !== undefined && { locale: dto.locale }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.seoTitle !== undefined && { seoTitle: dto.seoTitle }),
        ...(dto.seoDesc !== undefined && { seoDesc: dto.seoDesc }),
        ...(dto.ogImage !== undefined && { ogImage: dto.ogImage }),
      },
      include: { sections: { orderBy: { order: 'asc' } } },
    });

    await this.audit.createLog(userId, 'UPDATE', 'Page', page.id, dto as Record<string, unknown>);
    return page;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    await this.prisma.page.delete({ where: { id } });
    await this.audit.createLog(userId, 'DELETE', 'Page', id);
  }
}
