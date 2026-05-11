import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import slugify from 'slugify';
import { ContentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, trim: true });
  }

  async findAll(page = 1, limit = 20, status?: ContentStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Blog post ${id} not found`);
    return post;
  }

  async create(dto: CreateBlogPostDto, userId: string) {
    const slug = dto.slug ?? this.generateSlug(dto.title);

    const existing = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existing) throw new ConflictException(`Slug "${slug}" is already in use`);

    const post = await this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        featuredImage: dto.featuredImage,
        status: dto.status,
        seoTitle: dto.seoTitle,
        seoDesc: dto.seoDesc,
      },
    });

    await this.audit.createLog(userId, 'CREATE', 'BlogPost', post.id, { title: post.title, slug: post.slug });
    return post;
  }

  async update(id: string, dto: UpdateBlogPostDto, userId: string) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.blogPost.findUnique({ where: { slug: dto.slug } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Slug "${dto.slug}" is already in use`);
      }
    }

    const slug = dto.title && !dto.slug ? this.generateSlug(dto.title) : dto.slug;

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(slug !== undefined && { slug }),
        ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.featuredImage !== undefined && { featuredImage: dto.featuredImage }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.seoTitle !== undefined && { seoTitle: dto.seoTitle }),
        ...(dto.seoDesc !== undefined && { seoDesc: dto.seoDesc }),
      },
    });

    await this.audit.createLog(userId, 'UPDATE', 'BlogPost', post.id, dto as Record<string, unknown>);
    return post;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    await this.prisma.blogPost.delete({ where: { id } });
    await this.audit.createLog(userId, 'DELETE', 'BlogPost', id);
  }

  async publish(id: string, userId: string) {
    await this.findOne(id);

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: {
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    await this.audit.createLog(userId, 'PUBLISH', 'BlogPost', id);
    return post;
  }

  async unpublish(id: string, userId: string) {
    await this.findOne(id);

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: {
        status: ContentStatus.DRAFT,
        publishedAt: null,
      },
    });

    await this.audit.createLog(userId, 'UNPUBLISH', 'BlogPost', id);
    return post;
  }
}
