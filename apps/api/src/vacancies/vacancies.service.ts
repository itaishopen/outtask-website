import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import slugify from 'slugify';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacancyFilterDto } from './dto/vacancy-filter.dto';

@Injectable()
export class VacanciesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, trim: true });
  }

  async findAll(filter: VacancyFilterDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.VacancyWhereInput = {};
    if (filter.department) where.department = filter.department;
    if (filter.employmentType) where.employmentType = filter.employmentType;
    if (filter.status) where.status = filter.status;
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.vacancy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vacancy.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const vacancy = await this.prisma.vacancy.findUnique({ where: { id } });
    if (!vacancy) throw new NotFoundException(`Vacancy ${id} not found`);
    return vacancy;
  }

  async create(dto: CreateVacancyDto, userId: string) {
    const slug = dto.slug ?? this.generateSlug(dto.title);

    const existing = await this.prisma.vacancy.findUnique({ where: { slug } });
    if (existing) throw new ConflictException(`Slug "${slug}" is already in use`);

    const vacancy = await this.prisma.vacancy.create({
      data: {
        title: dto.title,
        slug,
        location: dto.location,
        department: dto.department,
        employmentType: dto.employmentType,
        seniority: dto.seniority,
        description: dto.description,
        requirements: dto.requirements,
        benefits: dto.benefits,
        applyUrl: dto.applyUrl,
        status: dto.status,
        providerId: dto.providerId,
      },
    });

    await this.audit.createLog(userId, 'CREATE', 'Vacancy', vacancy.id, { title: vacancy.title, slug: vacancy.slug });
    return vacancy;
  }

  async update(id: string, dto: UpdateVacancyDto, userId: string) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.vacancy.findUnique({ where: { slug: dto.slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Slug "${dto.slug}" is already in use`);
      }
    }

    const slug = dto.title && !dto.slug ? this.generateSlug(dto.title) : dto.slug;

    const vacancy = await this.prisma.vacancy.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(slug !== undefined && { slug }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.department !== undefined && { department: dto.department }),
        ...(dto.employmentType !== undefined && { employmentType: dto.employmentType }),
        ...(dto.seniority !== undefined && { seniority: dto.seniority }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.requirements !== undefined && { requirements: dto.requirements }),
        ...(dto.benefits !== undefined && { benefits: dto.benefits }),
        ...(dto.applyUrl !== undefined && { applyUrl: dto.applyUrl }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.providerId !== undefined && { providerId: dto.providerId }),
      },
    });

    await this.audit.createLog(userId, 'UPDATE', 'Vacancy', vacancy.id, dto as Record<string, unknown>);
    return vacancy;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    await this.prisma.vacancy.delete({ where: { id } });
    await this.audit.createLog(userId, 'DELETE', 'Vacancy', id);
  }
}
