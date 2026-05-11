import { ContentStatus } from './enums';

export interface Vacancy {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  department: string | null;
  employmentType: string | null;
  seniority: string | null;
  description: string;
  requirements: string | null;
  benefits: string | null;
  applyUrl: string | null;
  externalId: string | null;
  providerId: string | null;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VacancyFilter {
  department?: string;
  employmentType?: string;
  location?: string;
  search?: string;
  status?: ContentStatus;
}
