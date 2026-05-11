import { JobProvider, ExternalJob } from '../job-provider.interface';

interface GreenhouseConfig {
  boardToken: string;
}

interface GreenhouseJob {
  id: number;
  title: string;
  updated_at: string;
  location: { name: string };
  departments: Array<{ name: string }>;
  content: string;
  absolute_url: string;
  metadata: Array<{ name: string; value: string | null }>;
}

interface GreenhouseResponse {
  jobs: GreenhouseJob[];
}

export class GreenhouseProvider implements JobProvider {
  readonly name = 'greenhouse';
  private readonly baseUrl = 'https://boards-api.greenhouse.io/v1/boards';

  async fetchJobs(config: Record<string, unknown>): Promise<ExternalJob[]> {
    const { boardToken } = config as GreenhouseConfig;

    if (!boardToken) {
      throw new Error('GreenhouseProvider requires boardToken in config');
    }

    const response = await fetch(`${this.baseUrl}/${boardToken}/jobs?content=true`);

    if (!response.ok) {
      throw new Error(`Greenhouse API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as GreenhouseResponse;

    return data.jobs.map((job) => ({
      externalId: String(job.id),
      title: job.title,
      location: job.location?.name,
      department: job.departments?.[0]?.name,
      description: job.content ?? '',
      applyUrl: job.absolute_url,
    }));
  }
}
