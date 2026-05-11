import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { TestimonialsConfig } from '@outtask/shared-types';

@Component({
  selector: 'lib-testimonials-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <section class="testimonials section bg-alt">
      <div class="container">
        @if (config().heading) {
          <div class="section-header section-header--center">
            <h2 class="section-title">{{ config().heading }}</h2>
          </div>
        }
        <div class="testimonials__track">
          @for (t of config().testimonials; track t.author) {
            <article class="testimonials__card">
              <blockquote class="testimonials__quote">"{{ t.quote }}"</blockquote>
              <div class="testimonials__author">
                <div class="testimonials__avatar">
                  @if (t.avatar) {
                    <img [src]="t.avatar" [alt]="t.author" loading="lazy" />
                  } @else {
                    <span>{{ getInitials(t.author) }}</span>
                  }
                </div>
                <div>
                  <p class="testimonials__author-name">{{ t.author }}</p>
                  @if (t.title || t.company) {
                    <p class="testimonials__author-meta">
                      {{ t.title }}{{ t.title && t.company ? ' · ' : '' }}{{ t.company }}
                    </p>
                  }
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .testimonials { padding-block: 5rem; background-color: var(--color-bg-alt, #f8fafc); }

    .testimonials__track {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding-bottom: 0.5rem;
    }

    .testimonials__track::-webkit-scrollbar { display: none; }

    @media (min-width: 768px) {
      .testimonials__track {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        overflow: visible;
      }
    }

    .testimonials__card {
      scroll-snap-align: start;
      flex: 0 0 min(80vw, 340px);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 2rem;
      background: var(--color-bg, #fff);
      border-radius: var(--radius-md, 12px);
      box-shadow: var(--shadow-md, 0 4px 16px rgba(0,0,0,0.08));
    }

    @media (min-width: 768px) {
      .testimonials__card { flex: unset; }
    }

    .testimonials__quote {
      font-size: 1rem;
      line-height: 1.75;
      color: var(--color-text, #1e293b);
      font-style: italic;
      margin: 0;
    }

    .testimonials__author {
      display: flex;
      align-items: center;
      gap: 0.875rem;
    }

    .testimonials__avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;

      span { font-size: 0.8125rem; font-weight: 700; color: #fff; }
      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .testimonials__author-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--color-dark, #0f172a);
      margin: 0;
    }

    .testimonials__author-meta {
      font-size: 0.8125rem;
      color: var(--color-text-muted, #64748b);
      margin: 0;
    }
  `],
})
export class TestimonialsSectionComponent {
  readonly config = input.required<TestimonialsConfig>();

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  }
}
