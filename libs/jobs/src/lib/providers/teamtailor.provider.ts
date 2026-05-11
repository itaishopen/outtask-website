import { JobProvider, ExternalJob } from '../job-provider.interface';

interface TeamtailorConfig {
  apiToken: string;
  companySubdomain: string;
}

interface TeamtailorJob {
  id: string;
  attributes: {
    title: string;
    body: string;
    'remote-status'?: string;
  };
  relationships?: {
    department?: { data?: { id: string } };
    location?: { data?: { id: string } };
  };
}

interface TeamtailorResponse {
  data: TeamtailorJob[];
}

export class TeamtailorProvider implements JobProvider {
  readonly name = 'teamtailor';
  private readonly baseUrl = 'https://api.teamtailor.com/v1';

  async fetchJobs(config: Record<string, unknown>): Promise<ExternalJob[]> {
    const { apiToken, companySubdomain } = config as TeamtailorConfig;

    if (!apiToken) {
      throw new Error('TeamtailorProvider requires apiToken in config');
    }

    const response = await fetch(`${this.baseUrl}/jobs`, {
      headers: {
        Authorization: `Token token=${apiToken}`,
        'X-Api-Version': '20210218',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Teamtailor API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as TeamtailorResponse;

    return data.data.map((job) => ({
      externalId: job.id,
      title: job.attributes.title,
      description: job.attributes.body ?? '',
      applyUrl: `https://${companySubdomain}.teamtailor.com/jobs/${job.id}`,
    }));
  }
}
