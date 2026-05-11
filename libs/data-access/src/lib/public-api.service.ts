import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResponse,
  PaginatedResponse,
  Page,
  BlogPost,
  BlogPostSummary,
  Vacancy,
  VacancyFilter,
} from '@outtask/shared-types';
import { API_BASE_URL } from './api-base-url.token';

@Injectable({ providedIn: 'root' })
export class PublicApiService {
  private http = inject(HttpClient);
  private baseUrl = inject(API_BASE_URL);

  getPage(slug: string): Observable<Page> {
    return this.http
      .get<ApiResponse<Page>>(`${this.baseUrl}/public/pages/${slug}`)
      .pipe(map((r) => r.data));
  }

  getVacancies(filter?: VacancyFilter, page = 1, limit = 20): Observable<PaginatedResponse<Vacancy>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (filter?.department) params = params.set('department', filter.department);
    if (filter?.employmentType) params = params.set('employmentType', filter.employmentType);
    if (filter?.location) params = params.set('location', filter.location);
    if (filter?.search) params = params.set('search', filter.search);

    return this.http
      .get<ApiResponse<PaginatedResponse<Vacancy>>>(`${this.baseUrl}/public/vacancies`, { params })
      .pipe(map((r) => r.data));
  }

  getVacancy(slug: string): Observable<Vacancy> {
    return this.http
      .get<ApiResponse<Vacancy>>(`${this.baseUrl}/public/vacancies/${slug}`)
      .pipe(map((r) => r.data));
  }

  getBlogPosts(page = 1, limit = 10): Observable<PaginatedResponse<BlogPostSummary>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http
      .get<ApiResponse<PaginatedResponse<BlogPostSummary>>>(`${this.baseUrl}/public/blog`, {
        params,
      })
      .pipe(map((r) => r.data));
  }

  getBlogPost(slug: string): Observable<BlogPost> {
    return this.http
      .get<ApiResponse<BlogPost>>(`${this.baseUrl}/public/blog/${slug}`)
      .pipe(map((r) => r.data));
  }
}
