import { Injectable } from '@nestjs/common';
import { JobProvider, ExternalJob } from '../job-provider.interface';

@Injectable()
export class ManualProvider implements JobProvider {
  readonly name = 'manual';

  async fetchJobs(_config: Record<string, unknown>): Promise<ExternalJob[]> {
    // Manual jobs are entered directly via the admin panel — no external source
    return [];
  }
}
