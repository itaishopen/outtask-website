import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { ManualProvider } from './providers/manual.provider';
import { RecruiteeProvider } from './providers/recruitee.provider';

@Module({
  imports: [AuditModule],
  controllers: [JobsController],
  providers: [JobsService, ManualProvider, RecruiteeProvider],
  exports: [JobsService],
})
export class JobsModule {}
