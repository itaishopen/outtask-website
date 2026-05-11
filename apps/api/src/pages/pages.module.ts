import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

@Module({
  imports: [AuditModule],
  controllers: [PagesController, SectionsController],
  providers: [PagesService, SectionsService],
  exports: [PagesService],
})
export class PagesModule {}
