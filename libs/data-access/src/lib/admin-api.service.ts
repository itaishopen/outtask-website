import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResponse,
  PaginatedResponse,
  Page,
  BlogPost,
  Vacancy,
  MediaAsset,
  JobProviderConfig,
  AuthUser,
} from '@outtask/shared-types';
import { API_BASE_URL } from './api-base-url.token';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  // ─── Auth ─────────────────────────────────────────────────────────────────

  getMe(): Observable<AuthUser> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.baseUrl}/auth/me`).pipe(map((r) => r.data));
  }

  // ─── Pages ────────────────────────────────────────────────────────────────

  listPages(page = 1, limit = 20): Observable<PaginatedResponse<Page>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http
      .get<ApiResponse<PaginatedResponse<Page>>>(`${this.baseUrl}/admin/pages`, { params })
      .pipe(map((r) => r.data));
  }

  getPage(id: string): Observable<Page> {
    return this.http
      .get<ApiResponse<Page>>(`${this.baseUrl}/admin/pages/${id}`)
      .pipe(map((r) => r.data));
  }

  createPage(data: Partial<Page>): Observable<Page> {
    return this.http
      .post<ApiResponse<Page>>(`${this.baseUrl}/admin/pages`, data)
      .pipe(map((r) => r.data));
  }

  updatePage(id: string, data: Partial<Page>): Observable<Page> {
    return this.http
      .patch<ApiResponse<Page>>(`${this.baseUrl}/admin/pages/${id}`, data)
      .pipe(map((r) => r.data));
  }

  deletePage(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/admin/pages/${id}`)
      .pipe(map(() => undefined));
  }

  // ─── Blog ─────────────────────────────────────────────────────────────────

  listPosts(page = 1, limit = 20, status?: string): Observable<PaginatedResponse<BlogPost>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (status) params = params.set('status', status);
    return this.http
      .get<ApiResponse<PaginatedResponse<BlogPost>>>(`${this.baseUrl}/admin/blog`, { params })
      .pipe(map((r) => r.data));
  }

  getPost(id: string): Observable<BlogPost> {
    return this.http
      .get<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog/${id}`)
      .pipe(map((r) => r.data));
  }

  createPost(data: Partial<BlogPost>): Observable<BlogPost> {
    return this.http
      .post<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog`, data)
      .pipe(map((r) => r.data));
  }

  updatePost(id: string, data: Partial<BlogPost>): Observable<BlogPost> {
    return this.http
      .patch<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog/${id}`, data)
      .pipe(map((r) => r.data));
  }

  deletePost(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/admin/blog/${id}`)
      .pipe(map(() => undefined));
  }

  publishPost(id: string): Observable<BlogPost> {
    return this.http
      .post<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog/${id}/publish`, {})
      .pipe(map((r) => r.data));
  }

  unpublishPost(id: string): Observable<BlogPost> {
    return this.http
      .post<ApiResponse<BlogPost>>(`${this.baseUrl}/admin/blog/${id}/unpublish`, {})
      .pipe(map((r) => r.data));
  }

  // ─── Vacancies ────────────────────────────────────────────────────────────

  listVacancies(page = 1, limit = 20): Observable<PaginatedResponse<Vacancy>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http
      .get<ApiResponse<PaginatedResponse<Vacancy>>>(`${this.baseUrl}/admin/vacancies`, { params })
      .pipe(map((r) => r.data));
  }

  createVacancy(data: Partial<Vacancy>): Observable<Vacancy> {
    return this.http
      .post<ApiResponse<Vacancy>>(`${this.baseUrl}/admin/vacancies`, data)
      .pipe(map((r) => r.data));
  }

  updateVacancy(id: string, data: Partial<Vacancy>): Observable<Vacancy> {
    return this.http
      .patch<ApiResponse<Vacancy>>(`${this.baseUrl}/admin/vacancies/${id}`, data)
      .pipe(map((r) => r.data));
  }

  deleteVacancy(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/admin/vacancies/${id}`)
      .pipe(map(() => undefined));
  }

  syncVacancies(): Observable<unknown> {
    return this.http
      .post<ApiResponse<unknown>>(`${this.baseUrl}/admin/vacancies/sync`, {})
      .pipe(map((r) => r.data));
  }

  // ─── Job Providers ────────────────────────────────────────────────────────

  listProviders(): Observable<JobProviderConfig[]> {
    return this.http
      .get<ApiResponse<JobProviderConfig[]>>(`${this.baseUrl}/admin/jobs/providers`)
      .pipe(map((r) => r.data));
  }

  createProvider(data: Partial<JobProviderConfig>): Observable<JobProviderConfig> {
    return this.http
      .post<ApiResponse<JobProviderConfig>>(`${this.baseUrl}/admin/jobs/providers`, data)
      .pipe(map((r) => r.data));
  }

  updateProvider(id: string, data: Partial<JobProviderConfig>): Observable<JobProviderConfig> {
    return this.http
      .patch<ApiResponse<JobProviderConfig>>(`${this.baseUrl}/admin/jobs/providers/${id}`, data)
      .pipe(map((r) => r.data));
  }

  deleteProvider(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/admin/jobs/providers/${id}`)
      .pipe(map(() => undefined));
  }

  syncProvider(id: string): Observable<unknown> {
    return this.http
      .post<ApiResponse<unknown>>(`${this.baseUrl}/admin/jobs/providers/${id}/sync`, {})
      .pipe(map((r) => r.data));
  }

  // ─── Media ────────────────────────────────────────────────────────────────

  uploadFile(file: File): Observable<MediaAsset> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<ApiResponse<MediaAsset>>(`${this.baseUrl}/admin/media/upload`, formData)
      .pipe(map((r) => r.data));
  }

  listMedia(page = 1, limit = 30): Observable<PaginatedResponse<MediaAsset>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http
      .get<ApiResponse<PaginatedResponse<MediaAsset>>>(`${this.baseUrl}/admin/media`, { params })
      .pipe(map((r) => r.data));
  }

  deleteMedia(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/admin/media/${id}`)
      .pipe(map(() => undefined));
  }

  // ─── Audit ────────────────────────────────────────────────────────────────

  listAuditLog(filters?: {
    entity?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<unknown>> {
    let params = new HttpParams()
      .set('page', filters?.page ?? 1)
      .set('limit', filters?.limit ?? 50);
    if (filters?.entity) params = params.set('entity', filters.entity);
    if (filters?.userId) params = params.set('userId', filters.userId);
    if (filters?.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params = params.set('dateTo', filters.dateTo);

    return this.http
      .get<ApiResponse<PaginatedResponse<unknown>>>(`${this.baseUrl}/admin/audit-log`, { params })
      .pipe(map((r) => r.data));
  }
}
