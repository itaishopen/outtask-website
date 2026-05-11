import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AdminApiService } from '../shared/services/admin-api.service';
import { Page, ContentStatus } from '@outtask/shared-types';

@Component({
  selector: 'app-page-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="page-list">
      <div class="page-header">
        <div>
          <h1 class="page-title">Pages</h1>
          <p class="page-subtitle">Manage your site's content pages.</p>
        </div>
        <a routerLink="/pages/new" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Page
        </a>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="loading-state">Loading pages&hellip;</div>
        } @else if (pages().length === 0) {
          <div class="empty-state">
            <p>No pages found.</p>
            <a routerLink="/pages/new" class="btn btn-primary btn-sm">Create your first page</a>
          </div>
        } @else {
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (page of pages(); track page.id) {
                <tr>
                  <td class="font-medium">{{ page.title }}</td>
                  <td class="text-muted"><code>{{ page.slug }}</code></td>
                  <td>
                    <span class="badge" [class.badge--published]="page.status === 'PUBLISHED'" [class.badge--draft]="page.status === 'DRAFT'">
                      {{ page.status }}
                    </span>
                  </td>
                  <td class="text-muted">{{ page.updatedAt | date:'dd MMM yyyy' }}</td>
                  <td class="col-actions">
                    <div class="action-btns">
                      <a [routerLink]="['/pages', page.id]" class="btn btn-ghost btn-sm">Edit</a>
                      <a [href]="'/' + page.slug" target="_blank" class="btn btn-ghost btn-sm">Preview</a>
                      <button class="btn btn-danger btn-sm" (click)="deletePage(page)">Delete</button>
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

    .col-actions {
      width: 200px;
    }

    .action-btns {
      display: flex;
      gap: 0.25rem;
    }

    .loading-state, .empty-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }
  `],
})
export class PageListComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly pages = signal<Page[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.loading.set(true);
    this.api.listPages().subscribe({
      next: (res) => {
        this.pages.set(res.data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  deletePage(page: Page): void {
    if (!confirm(`Delete "${page.title}"? This cannot be undone.`)) return;
    this.api.deletePage(page.id).subscribe({
      next: () => {
        this.pages.update((prev) => prev.filter((p) => p.id !== page.id));
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete page.');
      },
    });
  }
}
