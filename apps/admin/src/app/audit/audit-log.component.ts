import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, AuditLogEntry, AuditLogFilters } from '../shared/services/admin-api.service';

const ENTITY_TYPES = ['Page', 'BlogPost', 'Vacancy', 'JobProvider', 'MediaAsset', 'User'];

@Component({
  selector: 'app-audit-log',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="audit-log">
      <div class="page-header">
        <div>
          <h1 class="page-title">Audit Log</h1>
          <p class="page-subtitle">Track all changes made in the CMS.</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-bar card">
        <div class="filter-group">
          <label class="filter-label">Entity</label>
          <select class="form-input form-input--sm" [(ngModel)]="filters.entity" (ngModelChange)="applyFilters()">
            <option value="">All</option>
            @for (e of entityTypes; track e) {
              <option [value]="e">{{ e }}</option>
            }
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">From</label>
          <input type="date" class="form-input form-input--sm" [(ngModel)]="filters.dateFrom" (ngModelChange)="applyFilters()" />
        </div>
        <div class="filter-group">
          <label class="filter-label">To</label>
          <input type="date" class="form-input form-input--sm" [(ngModel)]="filters.dateTo" (ngModelChange)="applyFilters()" />
        </div>
        <button class="btn btn-ghost btn-sm" (click)="clearFilters()">Clear</button>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="loading-state">Loading audit log&hellip;</div>
        } @else if (entries().length === 0) {
          <div class="empty-state">No audit entries found.</div>
        } @else {
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
              </tr>
            </thead>
            <tbody>
              @for (entry of entries(); track entry.id) {
                <tr>
                  <td class="text-muted">{{ entry.createdAt | date:'dd MMM yyyy, HH:mm' }}</td>
                  <td>{{ entry.userEmail }}</td>
                  <td>
                    <span [class]="getActionClass(entry.action)">{{ entry.action }}</span>
                  </td>
                  <td>{{ entry.entity }}</td>
                  <td class="text-muted id-cell" [title]="entry.entityId">{{ entry.entityId.slice(0, 8) }}&hellip;</td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="pagination">
            <button
              class="btn btn-ghost btn-sm"
              [disabled]="currentPage() <= 1"
              (click)="goToPage(currentPage() - 1)"
            >
              &larr; Previous
            </button>
            <span class="page-info">
              Page {{ currentPage() }} of {{ totalPages() }}
              &bull; {{ total() }} total
            </span>
            <button
              class="btn btn-ghost btn-sm"
              [disabled]="currentPage() >= totalPages()"
              (click)="goToPage(currentPage() + 1)"
            >
              Next &rarr;
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 1.5rem;
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

    .badge--create {
      background: #dcfce7;
      color: #166534;
    }

    .badge--update {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge--delete {
      background: #fee2e2;
      color: #991b1b;
    }

    .badge--publish {
      background: #fef3c7;
      color: #92400e;
    }

    .id-cell {
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.75rem;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .page-info {
      font-size: 0.875rem;
      color: #64748b;
    }

    .loading-state, .empty-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }
  `],
})
export class AuditLogComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly entityTypes = ENTITY_TYPES;
  readonly entries = signal<AuditLogEntry[]>([]);
  readonly loading = signal(true);
  readonly total = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = 20;

  readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize) || 1);

  filters: AuditLogFilters = {
    entity: '',
    dateFrom: '',
    dateTo: '',
  };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const f: AuditLogFilters = {
      page: this.currentPage(),
      limit: this.pageSize,
    };
    if (this.filters.entity) f.entity = this.filters.entity;
    if (this.filters.dateFrom) f.dateFrom = this.filters.dateFrom;
    if (this.filters.dateTo) f.dateTo = this.filters.dateTo;

    this.api.listAuditLog(f).subscribe({
      next: (res) => {
        this.entries.set(res.data.data);
        this.total.set(res.data.total);
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
    this.currentPage.set(1);
    this.load();
  }

  clearFilters(): void {
    this.filters = { entity: '', dateFrom: '', dateTo: '' };
    this.currentPage.set(1);
    this.load();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.load();
  }

  getActionClass(action: string): string {
    const a = action.toLowerCase();
    if (a.includes('creat')) return 'badge badge--create';
    if (a.includes('updat') || a.includes('edit')) return 'badge badge--update';
    if (a.includes('delet')) return 'badge badge--delete';
    if (a.includes('publish')) return 'badge badge--publish';
    return 'badge';
  }
}
