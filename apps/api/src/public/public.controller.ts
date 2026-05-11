import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ContentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Public')
@Public()
@Controller('public')
export class PublicController {
  constructor(private readonly prisma: PrismaService) {}

  // ── Pages ────────────────────────────────────────────────────────────────────

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Get a published page by slug (public)' })
  async getPage(@Param('slug') slug: string) {
    const page = await this.prisma.page.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    if (!page) throw new NotFoundException(`Page "${slug}" not found`);
    return page;
  }

  // ── Blog ─────────────────────────────────────────────────────────────────────

  @Get('blog')
  @ApiOperation({ summary: 'List published blog posts (public, paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBlogPosts(@Query('page') page = 1, @Query('limit') limit = 10) {
    const p = Number(page);
    const l = Number(limit);
    const skip = (p - 1) * l;

    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where: { status: ContentStatus.PUBLISHED },
        skip,
        take: l,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          publishedAt: true,
          seoTitle: true,
          seoDesc: true,
        },
      }),
      this.prisma.blogPost.count({ where: { status: ContentStatus.PUBLISHED } }),
    ]);

    return { data, total, page: p, limit: l };
  }

  @Get('blog/:slug')
  @ApiOperation({ summary: 'Get a single published blog post by slug (public)' })
  async getBlogPost(@Param('slug') slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
    });
    if (!post) throw new NotFoundException(`Blog post "${slug}" not found`);
    return post;
  }

  // ── Vacancies ────────────────────────────────────────────────────────────────

  @Get('vacancies')
  @ApiOperation({ summary: 'List published vacancies with filters (public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'department', required: false, type: String })
  @ApiQuery({ name: 'employmentType', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getVacancies(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('department') department?: string,
    @Query('employmentType') employmentType?: string,
    @Query('location') location?: string,
    @Query('search') search?: string,
  ) {
    const p = Number(page);
    const l = Number(limit);
    const skip = (p - 1) * l;

    const where: Prisma.VacancyWhereInput = { status: ContentStatus.PUBLISHED };
    if (department) where.department = department;
    if (employmentType) where.employmentType = employmentType;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.vacancy.findMany({
        where,
        skip,
        take: l,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vacancy.count({ where }),
    ]);

    return { data, total, page: p, limit: l };
  }

  @Get('vacancies/:slug')
  @ApiOperation({ summary: 'Get a single published vacancy by slug (public)' })
  async getVacancy(@Param('slug') slug: string) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
    });
    if (!vacancy) throw new NotFoundException(`Vacancy "${slug}" not found`);
    return vacancy;
  }
}
