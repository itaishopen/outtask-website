import { JobProvider, ExternalJob } from '../job-provider.interface';

export class ManualJobProvider implements JobProvider {
  readonly name = 'manual';

  async fetchJobs(_config: Record<string, unknown>): Promise<ExternalJob[]> {
    // Manual jobs are entered directly in the admin panel.
    // This provider has no external source to sync from.
    return [];
  }
}
