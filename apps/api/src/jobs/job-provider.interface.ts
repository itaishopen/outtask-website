export interface ExternalJob {
  externalId: string;
  title: string;
  slug?: string;
  location?: string;
  department?: string;
  employmentType?: string;
  seniority?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  applyUrl?: string;
}

export interface JobProvider {
  readonly name: string;
  fetchJobs(config: Record<string, unknown>): Promise<ExternalJob[]>;
}
