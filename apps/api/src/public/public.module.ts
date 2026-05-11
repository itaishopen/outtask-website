import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { SitemapController } from './sitemap.controller';

@Module({
  controllers: [PublicController, SitemapController],
})
export class PublicModule {}
