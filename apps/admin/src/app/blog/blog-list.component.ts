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
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../shared/services/admin-api.service';
import { BlogPost, ContentStatus } from '@outtask/shared-types';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, DatePipe, FormsModule],
  template: `
    <div class="blog-list">
      <div class="page-header">
        <div>
          <h1 class="page-title">Blog</h1>
          <p class="page-subtitle">Manage your blog posts.</p>
        </div>
        <a routerLink="/blog/new" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Post
        </a>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <button
          class="filter-btn"
          [class.active]="statusFilter() === null"
          (click)="setFilter(null)"
        >All</button>
        <button
          class="filter-btn"
          [class.active]="statusFilter() === 'PUBLISHED'"
          (click)="setFilter('PUBLISHED')"
        >Published</button>
        <button
          class="filter-btn"
          [class.active]="statusFilter() === 'DRAFT'"
          (click)="setFilter('DRAFT')"
        >Drafts</button>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="loading-state">Loading posts&hellip;</div>
        } @else if (filtered().length === 0) {
          <div class="empty-state">
            <p>No posts found.</p>
            <a routerLink="/blog/new" class="btn btn-primary btn-sm">Create your first post</a>
          </div>
        } @else {
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Published</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (post of filtered(); track post.id) {
                <tr>
                  <td class="font-medium">{{ post.title }}</td>
                  <td>
                    <span class="badge" [class.badge--published]="post.status === 'PUBLISHED'" [class.badge--draft]="post.status === 'DRAFT'">
                      {{ post.status }}
                    </span>
                  </td>
                  <td class="text-muted">
                    {{ post.publishedAt ? (post.publishedAt | date:'dd MMM yyyy') : '—' }}
                  </td>
                  <td class="col-actions">
                    <div class="action-btns">
                      <a [routerLink]="['/blog', post.id]" class="btn btn-ghost btn-sm">Edit</a>
                      <button class="btn btn-danger btn-sm" (click)="deletePost(post)">Delete</button>
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
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .filter-btn {
      padding: 0.375rem 0.875rem;
      border-radius: 99px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.1s;

      &:hover, &.active {
        background: #0f172a;
        color: white;
        border-color: #0f172a;
      }
    }

    .col-actions {
      width: 140px;
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
export class BlogListComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly posts = signal<BlogPost[]>([]);
  readonly loading = signal(true);
  readonly statusFilter = signal<string | null>(null);

  readonly filtered = computed(() => {
    const f = this.statusFilter();
    return f ? this.posts().filter((p) => p.status === f) : this.posts();
  });

  ngOnInit(): void {
    this.api.listPosts().subscribe({
      next: (res) => {
        this.posts.set(res.data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  setFilter(status: string | null): void {
    this.statusFilter.set(status);
  }

  deletePost(post: BlogPost): void {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    this.api.deletePost(post.id).subscribe({
      next: () => {
        this.posts.update((prev) => prev.filter((p) => p.id !== post.id));
        this.cdr.markForCheck();
      },
      error: () => alert('Failed to delete post.'),
    });
  }
}
