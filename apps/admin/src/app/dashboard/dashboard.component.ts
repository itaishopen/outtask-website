import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminApiService, AuditLogEntry } from '../shared/services/admin-api.service';
import { AuthStateService } from '../shared/services/auth-state.service';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back, {{ currentUser()?.name ?? 'there' }}.</p>
      </div>

      <!-- Stats cards -->
      <div class="stats-grid">
        @for (stat of stats(); track stat.label) {
          <div class="stat-card" [style.--accent]="stat.color">
            <div class="stat-icon" [innerHTML]="stat.icon"></div>
            <div class="stat-body">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        }
      </div>

      <div class="dashboard-grid">
        <!-- Recent audit log -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Recent Changes</h2>
          </div>
          <div class="card-body">
            @if (loadingAudit()) {
              <div class="loading-state">Loading&hellip;</div>
            } @else if (auditEntries().length === 0) {
              <div class="empty-state">No recent activity.</div>
            } @else {
              <table class="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Entity</th>
                  </tr>
                </thead>
                <tbody>
                  @for (entry of auditEntries(); track entry.id) {
                    <tr>
                      <td class="text-muted">{{ entry.createdAt | date:'dd MMM, HH:mm' }}</td>
                      <td>{{ entry.userEmail }}</td>
                      <td><span class="badge badge--action">{{ entry.action }}</span></td>
                      <td>{{ entry.entity }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        </div>

        <!-- Quick actions -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Quick Actions</h2>
          </div>
          <div class="card-body quick-actions">
            <a routerLink="/blog/new" class="quick-action">
              <span class="qa-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </span>
              <div>
                <div class="qa-label">New Blog Post</div>
                <div class="qa-sub">Create and publish content</div>
              </div>
            </a>
            <a routerLink="/vacancies/new" class="quick-action">
              <span class="qa-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </span>
              <div>
                <div class="qa-label">New Vacancy</div>
                <div class="qa-sub">Post a job opening</div>
              </div>
            </a>
            <a href="/" target="_blank" class="quick-action">
              <span class="qa-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </span>
              <div>
                <div class="qa-label">View Website</div>
                <div class="qa-sub">Open the live site</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {}

    .page-header {
      margin-bottom: 1.5rem;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.25rem;
    }

    .page-subtitle {
      color: #64748b;
      margin: 0;
      font-size: 0.875rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid #e2e8f0;
      border-left: 3px solid var(--accent, #3b82f6);
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--accent, #3b82f6) 12%, white);
      border-radius: 8px;
      color: var(--accent, #3b82f6);
      flex-shrink: 0;

      ::ng-deep svg {
        width: 20px;
        height: 20px;
      }
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 1rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem;
    }

    .quick-action {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      color: #0f172a;
      transition: background 0.1s;

      &:hover {
        background: #f1f5f9;
      }
    }

    .qa-icon {
      width: 36px;
      height: 36px;
      background: #f1f5f9;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
      flex-shrink: 0;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .qa-label {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .qa-sub {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .badge--action {
      background: #e0f2fe;
      color: #0369a1;
    }

    .loading-state, .empty-state {
      color: #94a3b8;
      font-size: 0.875rem;
      padding: 1rem 0;
      text-align: center;
    }
  `],
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly authState = inject(AuthStateService);
  readonly currentUser = this.authState.currentUser;

  readonly stats = signal<StatCard[]>([
    {
      label: 'Total Pages',
      value: 0,
      color: '#3b82f6',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    },
    {
      label: 'Published Posts',
      value: 0,
      color: '#10b981',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    },
    {
      label: 'Open Vacancies',
      value: 0,
      color: '#f59e0b',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    },
    {
      label: 'Recent Changes',
      value: 0,
      color: '#8b5cf6',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>`,
    },
  ]);

  readonly auditEntries = signal<AuditLogEntry[]>([]);
  readonly loadingAudit = signal(true);

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe({
      next: (res) => {
        const s = res.data;
        this.stats.update((prev) =>
          prev.map((card, i) => ({
            ...card,
            value: [s.totalPages, s.publishedPosts, s.openVacancies, s.recentChanges][i] ?? 0,
          })),
        );
        this.cdr.markForCheck();
      },
      error: () => {},
    });

    this.api.listAuditLog({ limit: 8 }).subscribe({
      next: (res) => {
        this.auditEntries.set(res.data.data);
        this.loadingAudit.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingAudit.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
