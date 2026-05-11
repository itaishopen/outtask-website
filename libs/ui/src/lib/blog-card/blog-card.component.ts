import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogPostSummary } from '@outtask/shared-types';

@Component({
  selector: 'lib-blog-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="blog-card" data-testid="blog-card">
      <a [routerLink]="['/en/blog', post().slug]" class="blog-card__link">
        @if (post().featuredImage) {
          <div class="blog-card__image-wrapper">
            <img
              [src]="post().featuredImage"
              [alt]="post().title"
              class="blog-card__image"
              loading="lazy"
            />
          </div>
        } @else {
          <div class="blog-card__image-placeholder" aria-hidden="true">
            <span>📝</span>
          </div>
        }
        <div class="blog-card__body">
          @if (post().publishedAt) {
            <time class="blog-card__date" [dateTime]="post().publishedAt!">
              {{ post().publishedAt | date: 'MMM d, yyyy' }}
            </time>
          }
          <h3 class="blog-card__title">{{ post().title }}</h3>
          @if (post().excerpt) {
            <p class="blog-card__excerpt">{{ post().excerpt }}</p>
          }
          <span class="blog-card__cta">Read article →</span>
        </div>
      </a>
    </article>
  `,
  styles: [`
    .blog-card {
      background: var(--color-bg, #fff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-md, 12px);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-lg, 0 8px 30px rgba(0,0,0,0.1));
      }

      &__link {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        color: inherit;
        height: 100%;
      }

      &__image-wrapper {
        aspect-ratio: 16/9;
        overflow: hidden;
      }

      &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;

        .blog-card:hover & {
          transform: scale(1.03);
        }
      }

      &__image-placeholder {
        aspect-ratio: 16/9;
        background: var(--color-bg-alt, #f8fafc);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
      }

      &__body {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
      }

      &__date {
        font-size: 0.8125rem;
        color: var(--color-text-muted, #64748b);
        font-weight: 500;
      }

      &__title {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--color-dark, #0f172a);
        line-height: 1.4;
        margin: 0;
      }

      &__excerpt {
        font-size: 0.9375rem;
        color: var(--color-text-muted, #64748b);
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin: 0;
      }

      &__cta {
        margin-top: auto;
        padding-top: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-primary, #2563eb);
      }
    }
  `],
})
export class BlogCardComponent {
  post = input.required<BlogPostSummary>();
}
