import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens/api-base-url.token';
import {
  ApiResponse,
  PaginatedResponse,
  Page,
  BlogPost,
  Vacancy,
  MediaAsset,
  JobProviderConfig,
  AuthUser,
  SyncResult,
} from '@outtask/shared-types';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
}

export interface AuditLogFilters {
  entity?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export type CreatePageDto = Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'sections'>;
export type UpdatePageDto = Partial<CreatePageDto>;

export type CreatePostDto = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>;
export type UpdatePostDto = Partial<CreatePostDto>;

export type CreateVacancyDto = Omit<
  Vacancy,
  'id' | 'createdAt' | 'updatedAt' | 'externalId' | 'providerId' | 'slug'
>;
export type UpdateVacancyDto = Partial<CreateVacancyDto>;

export type CreateProviderDto = Omit<JobProviderConfig, 'id' | 'createdAt' | 'updatedAt' | 'lastSyncAt'>;
export type UpdateProviderDto = Partial<CreateProviderDto>;

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  // ─── Pages ────────────────────────────────────────────────────────────────

  listPages(): Observable<ApiResponse<Page[]>> {
    return this.http.get<ApiResponse<Page[]>>(`${this.baseUrl}/admin/pages`);
  }

  getPage(id: string): Observable<ApiResponse<Page>> {
    return this.http.get<ApiResponse<Page>>(`${this.baseUrl}/admin/pages/${id}`);
  }

  createPage(dto: CreatePageDto): Observable<ApiResponse<Page>> {
    return this.http.post<ApiResponse<Page>>(`${this.baseUrl}/admin/pages`, dto);
  }

  updatePage(id: string, dto: UpdatePageDto): Observable<ApiResponse<Page>> {
    return this.http.patch<ApiResponse<Page>>(`${this.baseUrl}/admin/pages/${id}`, dto);
  }

  deletePage(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/admin/pages/${id}`);
  }

  // ─── Blog ─────────────────────────────────────────────────────────────────

  listPosts(): Observable<ApiResponse<BlogPost[]>> {
    return this.http.get<ApiResponse<BlogPost[]>>(`${this.baseUrl}/admin/blog`);
  }

  getPost(id: string): Observable<ApiResponse<BlogPost>> {
    return this.http.get<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog/${id}`);
  }

  createPost(dto: CreatePostDto): Observable<ApiResponse<BlogPost>> {
    return this.http.post<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog`, dto);
  }

  updatePost(id: string, dto: UpdatePostDto): Observable<ApiResponse<BlogPost>> {
    return this.http.patch<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog/${id}`, dto);
  }

  deletePost(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/admin/blog/${id}`);
  }

  publishPost(id: string): Observable<ApiResponse<BlogPost>> {
    return this.http.post<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog/${id}/publish`, {});
  }

  unpublishPost(id: string): Observable<ApiResponse<BlogPost>> {
    return this.http.post<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog/${id}/unpublish`, {});
  }

  // ─── Vacancies ────────────────────────────────────────────────────────────

  listVacancies(): Observable<ApiResponse<Vacancy[]>> {
    return this.http.get<ApiResponse<Vacancy[]>>(`${this.baseUrl}/admin/vacancies`);
  }

  getVacancy(id: string): Observable<ApiResponse<Vacancy>> {
    return this.http.get<ApiResponse<Vacancy>>(`${this.baseUrl}/admin/vacancies/${id}`);
  }

  createVacancy(dto: CreateVacancyDto): Observable<ApiResponse<Vacancy>> {
    return this.http.post<ApiResponse<Vacancy>>(`${this.baseUrl}/admin/vacancies`, dto);
  }

  updateVacancy(id: string, dto: UpdateVacancyDto): Observable<ApiResponse<Vacancy>> {
    return this.http.patch<ApiResponse<Vacancy>>(`${this.baseUrl}/admin/vacancies/${id}`, dto);
  }

  deleteVacancy(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/admin/vacancies/${id}`);
  }

  syncVacancies(): Observable<ApiResponse<SyncResult[]>> {
    return this.http.post<ApiResponse<SyncResult[]>>(`${this.baseUrl}/admin/vacancies/sync`, {});
  }

  // ─── Job Providers ────────────────────────────────────────────────────────

  listProviders(): Observable<ApiResponse<JobProviderConfig[]>> {
    return this.http.get<ApiResponse<JobProviderConfig[]>>(`${this.baseUrl}/admin/job-providers`);
  }

  getProvider(id: string): Observable<ApiResponse<JobProviderConfig>> {
    return this.http.get<ApiResponse<JobProviderConfig>>(`${this.baseUrl}/admin/job-providers/${id}`);
  }

  createProvider(dto: CreateProviderDto): Observable<ApiResponse<JobProviderConfig>> {
    return this.http.post<ApiResponse<JobProviderConfig>>(`${this.baseUrl}/admin/job-providers`, dto);
  }

  updateProvider(id: string, dto: UpdateProviderDto): Observable<ApiResponse<JobProviderConfig>> {
    return this.http.patch<ApiResponse<JobProviderConfig>>(
      `${this.baseUrl}/admin/job-providers/${id}`,
      dto,
    );
  }

  deleteProvider(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/admin/job-providers/${id}`);
  }

  syncProvider(id: string): Observable<ApiResponse<SyncResult>> {
    return this.http.post<ApiResponse<SyncResult>>(
      `${this.baseUrl}/admin/job-providers/${id}/sync`,
      {},
    );
  }

  // ─── Media ────────────────────────────────────────────────────────────────

  listMedia(): Observable<ApiResponse<MediaAsset[]>> {
    return this.http.get<ApiResponse<MediaAsset[]>>(`${this.baseUrl}/admin/media`);
  }

  uploadFile(file: File): Observable<ApiResponse<MediaAsset>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<MediaAsset>>(`${this.baseUrl}/admin/media/upload`, formData);
  }

  deleteMedia(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/admin/media/${id}`);
  }

  // ─── Audit Log ────────────────────────────────────────────────────────────

  listAuditLog(
    filters: AuditLogFilters = {},
  ): Observable<ApiResponse<PaginatedResponse<AuditLogEntry>>> {
    let params = new HttpParams();
    if (filters.entity) params = params.set('entity', filters.entity);
    if (filters.userId) params = params.set('userId', filters.userId);
    if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    return this.http.get<ApiResponse<PaginatedResponse<AuditLogEntry>>>(
      `${this.baseUrl}/admin/audit`,
      { params },
    );
  }

  // ─── Users ────────────────────────────────────────────────────────────────

  getMe(): Observable<ApiResponse<AuthUser>> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.baseUrl}/auth/me`);
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────

  getDashboardStats(): Observable<
    ApiResponse<{
      totalPages: number;
      publishedPosts: number;
      openVacancies: number;
      recentChanges: number;
    }>
  > {
    return this.http.get<
      ApiResponse<{
        totalPages: number;
        publishedPosts: number;
        openVacancies: number;
        recentChanges: number;
      }>
    >(`${this.baseUrl}/admin/dashboard/stats`);
  }
}
