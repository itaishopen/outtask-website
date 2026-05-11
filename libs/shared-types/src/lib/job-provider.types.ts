export interface JobProviderConfig {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  enabled: boolean;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}

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

export interface SyncResult {
  providerId: string;
  providerName: string;
  created: number;
  updated: number;
  errors: string[];
  syncedAt: string;
}
