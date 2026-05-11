import { Injectable, NotImplementedException } from '@nestjs/common';
import { JobProvider, ExternalJob } from '../job-provider.interface';

@Injectable()
export class RecruiteeProvider implements JobProvider {
  readonly name = 'recruitee';

  async fetchJobs(_config: Record<string, unknown>): Promise<ExternalJob[]> {
    throw new NotImplementedException(
      'Recruitee provider is not yet implemented. ' +
        'To enable it, implement the fetchJobs method in RecruiteeProvider and ' +
        'supply a valid "apiToken" and "companySlug" in the provider config.',
    );
  }
}
