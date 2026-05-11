import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../shared/services/admin-api.service';
import { Vacancy } from '@outtask/shared-types';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="vacancy-list">
      <div class="page-header">
        <div>
          <h1 class="page-title">Vacancies</h1>
          <p class="page-subtitle">Manage job openings.</p>
        </div>
        <a routerLink="/vacancies/new" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Vacancy
        </a>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar card">
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <select class="form-input form-input--sm" [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
            <option value="">All</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Department</label>
          <select class="form-input form-input--sm" [(ngModel)]="departmentFilter" (ngModelChange)="applyFilters()">
            <option value="">All</option>
            @for (dept of departments(); track dept) {
              <option [value]="dept">{{ dept }}</option>
            }
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Type</label>
          <select class="form-input form-input--sm" [(ngModel)]="typeFilter" (ngModelChange)="applyFilters()">
            <option value="">All</option>
            @for (type of employmentTypes(); track type) {
              <option [value]="type">{{ type }}</option>
            }
          </select>
        </div>
        <button class="btn btn-ghost btn-sm" (click)="clearFilters()">Clear</button>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="loading-state">Loading vacancies&hellip;</div>
        } @else if (filtered().length === 0) {
          <div class="empty-state">
            <p>No vacancies found.</p>
            <a routerLink="/vacancies/new" class="btn btn-primary btn-sm">Post your first vacancy</a>
          </div>
        } @else {
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Department</th>
                <th>Type</th>
                <th>Status</th>
                <th>Source</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (vacancy of filtered(); track vacancy.id) {
                <tr>
                  <td class="font-medium">{{ vacancy.title }}</td>
                  <td class="text-muted">{{ vacancy.location ?? '—' }}</td>
                  <td class="text-muted">{{ vacancy.department ?? '—' }}</td>
                  <td class="text-muted">{{ vacancy.employmentType ?? '—' }}</td>
                  <td>
                    <span class="badge" [class.badge--published]="vacancy.status === 'PUBLISHED'" [class.badge--draft]="vacancy.status === 'DRAFT'">
                      {{ vacancy.status }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge--source" [class.badge--external]="vacancy.providerId">
                      {{ vacancy.providerId ? 'External' : 'Manual' }}
                    </span>
                  </td>
                  <td class="col-actions">
                    <div class="action-btns">
                      <a [routerLink]="['/vacancies', vacancy.id]" class="btn btn-ghost btn-sm">Edit</a>
                      <button class="btn btn-danger btn-sm" (click)="deleteVacancy(vacancy)">Delete</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      gap: 1rem;
    }

    .filter-bar {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      margin-bottom: 1rem;
      padding: 0.875rem 1rem;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .filter-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .col-actions {
      width: 140px;
    }

    .action-btns {
      display: flex;
      gap: 0.25rem;
    }

    .badge--source {
      background: #f1f5f9;
      color: #64748b;
    }

    .badge--external {
      background: #fef3c7;
      color: #92400e;
    }

    .loading-state, .empty-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }
  `],
})
export class VacancyListComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly vacancies = signal<Vacancy[]>([]);
  readonly loading = signal(true);

  statusFilter = '';
  departmentFilter = '';
  typeFilter = '';

  readonly departments = computed(() =>
    [...new Set(this.vacancies().map((v) => v.department).filter(Boolean) as string[])],
  );

  readonly employmentTypes = computed(() =>
    [...new Set(this.vacancies().map((v) => v.employmentType).filter(Boolean) as string[])],
  );

  readonly filtered = computed(() => {
    return this.vacancies().filter((v) => {
      if (this.statusFilter && v.status !== this.statusFilter) return false;
      if (this.departmentFilter && v.department !== this.departmentFilter) return false;
      if (this.typeFilter && v.employmentType !== this.typeFilter) return false;
      return true;
    });
  });

  ngOnInit(): void {
    this.api.listVacancies().subscribe({
      next: (res) => {
        this.vacancies.set(res.data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  applyFilters(): void {
    this.cdr.markForCheck();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.departmentFilter = '';
    this.typeFilter = '';
    this.cdr.markForCheck();
  }

  deleteVacancy(vacancy: Vacancy): void {
    if (!confirm(`Delete "${vacancy.title}"? This cannot be undone.`)) return;
    this.api.deleteVacancy(vacancy.id).subscribe({
      next: () => {
        this.vacancies.update((prev) => prev.filter((v) => v.id !== vacancy.id));
        this.cdr.markForCheck();
      },
      error: () => alert('Failed to delete vacancy.'),
    });
  }
}
