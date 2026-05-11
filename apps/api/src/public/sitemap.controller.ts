import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { ContentStatus } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';

@Controller()
@Public()
export class SitemapController {
  private readonly siteUrl = process.env['PUBLIC_SITE_URL'] ?? 'https://outtask.nl';

  constructor(private prisma: PrismaService) {}

  @Get('sitemap.xml')
  async getSitemap(@Res() res: Response) {
    const [pages, posts, vacancies] = await Promise.all([
      this.prisma.page.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
      this.prisma.blogPost.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
      this.prisma.vacancy.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const staticRoutes = [
      { loc: '/en/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/en/services/staffing', priority: '0.9', changefreq: 'monthly' },
      { loc: '/en/services/nearshoring', priority: '0.9', changefreq: 'monthly' },
      { loc: '/en/working-at-outtask', priority: '0.8', changefreq: 'monthly' },
      { loc: '/en/expats', priority: '0.7', changefreq: 'monthly' },
      { loc: '/en/happy-people', priority: '0.7', changefreq: 'monthly' },
      { loc: '/en/hire-a-developer', priority: '0.8', changefreq: 'monthly' },
      { loc: '/en/vacancies', priority: '0.9', changefreq: 'daily' },
      { loc: '/en/blog', priority: '0.8', changefreq: 'weekly' },
      { loc: '/en/contact', priority: '0.7', changefreq: 'monthly' },
    ];

    const dynamicRoutes = [
      ...pages.map((p) => ({
        loc: `/en/${p.slug}`,
        lastmod: p.updatedAt.toISOString().split('T')[0],
        priority: '0.7',
        changefreq: 'weekly',
      })),
      ...posts.map((p) => ({
        loc: `/en/blog/${p.slug}`,
        lastmod: p.updatedAt.toISOString().split('T')[0],
        priority: '0.6',
        changefreq: 'monthly',
      })),
      ...vacancies.map((v) => ({
        loc: `/en/vacancies/${v.slug}`,
        lastmod: v.updatedAt.toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'weekly',
      })),
    ];

    const allUrls = [
      ...staticRoutes.map((r) => ({ ...r, lastmod: new Date().toISOString().split('T')[0] })),
      ...dynamicRoutes,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${this.siteUrl}${url.loc}</loc>
    <lastmod>${url.lastmod ?? new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  }
}
