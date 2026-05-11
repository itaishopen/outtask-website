import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '@outtask/data-access';
import type { BlogListConfig, BlogPostSummary } from '@outtask/shared-types';
import { BlogCardComponent } from '@outtask/ui';

@Component({
  selector: 'lib-blog-list-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, BlogCardComponent],
  template: `
    <section class="blog-list-section section">
      <div class="container">
        @if (config().heading) {
          <div class="section-header section-header--center">
            <h2 class="section-title">{{ config().heading }}</h2>
          </div>
        }

        @if (loading()) {
          <div class="blog-list-section__grid">
            @for (_ of [1,2,3]; track $index) {
              <div class="blog-list-section__skeleton">
                <div class="skeleton" style="height:200px;margin-bottom:1rem;border-radius:12px"></div>
                <div class="skeleton" style="height:1.25rem;width:80%;margin-bottom:0.5rem"></div>
                <div class="skeleton" style="height:1rem;width:60%"></div>
              </div>
            }
          </div>
        } @else if (error()) {
          <p class="text-muted text-center">Could not load articles at this time.</p>
        } @else if (posts().length === 0) {
          <div class="empty-state">
            <p class="empty-state__title">No articles yet</p>
            <p class="empty-state__message">Check back soon for insights and updates.</p>
          </div>
        } @else {
          <div class="blog-list-section__grid">
            @for (post of posts(); track post.id) {
              <lib-blog-card [post]="post" />
            }
          </div>
          @if (config().showViewAll !== false) {
            <div class="blog-list-section__footer">
              <a routerLink="/en/blog" class="btn btn-outline">View all articles</a>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .blog-list-section { padding-block: 5rem; }

    .blog-list-section__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 640px) {
      .blog-list-section__grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (min-width: 1024px) {
      .blog-list-section__grid { grid-template-columns: repeat(3, 1fr); }
    }

    .blog-list-section__skeleton {
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-md, 12px);
      padding: 1rem;
    }

    .blog-list-section__footer {
      display: flex;
      justify-content: center;
      margin-top: 2.5rem;
    }

    .skeleton {
      background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
      display: block;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class BlogListSectionComponent implements OnInit {
  readonly config = input.required<BlogListConfig>();

  private readonly api = inject(PublicApiService);

  readonly posts = signal<BlogPostSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.api.getBlogPosts(1, this.config().limit ?? 3).subscribe({
      next: (res) => {
        this.posts.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
