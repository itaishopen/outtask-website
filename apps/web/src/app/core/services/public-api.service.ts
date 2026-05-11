import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../tokens/api.token';
import type {
  ApiResponse,
  PaginatedResponse,
  Page,
  Vacancy,
  VacancyFilter,
  BlogPost,
  BlogPostSummary,
} from '../../shared/models/api.models';

@Injectable({ providedIn: 'root' })
export class PublicApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  private url(path: string): string {
    return `${this.baseUrl}/public${path}`;
  }

  getPage(slug: string): Observable<ApiResponse<Page>> {
    return this.http.get<ApiResponse<Page>>(this.url(`/pages/${slug}`));
  }

  getVacancies(filter?: VacancyFilter): Observable<ApiResponse<PaginatedResponse<Vacancy>>> {
    let params = new HttpParams();
    if (filter?.department) params = params.set('department', filter.department);
    if (filter?.employmentType) params = params.set('employmentType', filter.employmentType);
    if (filter?.roleTag) params = params.set('roleTag', filter.roleTag);
    if (filter?.page != null) params = params.set('page', String(filter.page));
    if (filter?.limit != null) params = params.set('limit', String(filter.limit));

    return this.http.get<ApiResponse<PaginatedResponse<Vacancy>>>(this.url('/vacancies'), { params });
  }

  getVacancy(slug: string): Observable<ApiResponse<Vacancy>> {
    return this.http.get<ApiResponse<Vacancy>>(this.url(`/vacancies/${slug}`));
  }

  getBlogPosts(
    page = 1,
    limit = 12,
  ): Observable<ApiResponse<PaginatedResponse<BlogPostSummary>>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    return this.http.get<ApiResponse<PaginatedResponse<BlogPostSummary>>>(
      this.url('/blog'),
      { params },
    );
  }

  getBlogPost(slug: string): Observable<ApiResponse<BlogPost>> {
    return this.http.get<ApiResponse<BlogPost>>(this.url(`/blog/${slug}`));
  }
}
