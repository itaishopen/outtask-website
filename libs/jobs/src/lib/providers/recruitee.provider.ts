import { JobProvider, ExternalJob } from '../job-provider.interface';

interface RecruiteeConfig {
  companyId: string;
  apiToken: string;
}

interface RecruiteeOffer {
  id: number;
  title: string;
  slug: string;
  city?: string;
  department?: string;
  employment_type_code?: string;
  description?: string;
  requirements?: string;
  nice_to_haves?: string;
  offer_url?: string;
}

interface RecruiteeResponse {
  offers: RecruiteeOffer[];
}

export class RecruiteeProvider implements JobProvider {
  readonly name = 'recruitee';
  private readonly baseUrl = 'https://api.recruitee.com/c';

  async fetchJobs(config: Record<string, unknown>): Promise<ExternalJob[]> {
    const { companyId, apiToken } = config as RecruiteeConfig;

    if (!companyId || !apiToken) {
      throw new Error('RecruiteeProvider requires companyId and apiToken in config');
    }

    const response = await fetch(`${this.baseUrl}/${companyId}/offers`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Recruitee API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as RecruiteeResponse;

    return data.offers.map((offer) => ({
      externalId: String(offer.id),
      title: offer.title,
      slug: offer.slug,
      location: offer.city,
      department: offer.department,
      employmentType: offer.employment_type_code,
      description: offer.description ?? '',
      requirements: offer.requirements,
      benefits: offer.nice_to_haves,
      applyUrl: offer.offer_url,
    }));
  }
}
