import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CtaConfig } from '@outtask/shared-types';

@Component({
  selector: 'lib-cta-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section
      class="cta-section section"
      [class.cta-section--dark]="config().style === 'dark'"
      [class.cta-section--brand]="config().style === 'brand'"
    >
      <div class="container cta-section__inner">
        <div class="cta-section__text">
          <h2 class="cta-section__heading">{{ config().heading }}</h2>
          @if (config().subheading) {
            <p class="cta-section__sub">{{ config().subheading }}</p>
          }
        </div>
        <div class="cta-section__actions">
          @if (config().primaryCta) {
            <a
              [routerLink]="config().primaryCta!.href"
              class="btn btn-primary btn--lg"
            >
              {{ config().primaryCta!.label }}
            </a>
          }
          @if (config().secondaryCta) {
            <a
              [routerLink]="config().secondaryCta!.href"
              class="btn btn-outline btn-outline--white btn--lg"
            >
              {{ config().secondaryCta!.label }}
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .cta-section {
      padding-block: 5rem;
      background-color: var(--color-bg-alt, #f8fafc);
    }

    .cta-section--dark {
      background-color: var(--color-dark, #0f172a);
    }

    .cta-section--dark .cta-section__heading { color: #fff; }
    .cta-section--dark .cta-section__sub { color: rgba(255,255,255,0.7); }

    .cta-section--brand {
      background: linear-gradient(135deg, #0f172a 0%, #1a2d52 40%, #2563eb 100%);
    }

    .cta-section--brand .cta-section__heading { color: #fff; }
    .cta-section--brand .cta-section__sub { color: rgba(255,255,255,0.75); }

    .cta-section__inner {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: flex-start;
    }

    @media (min-width: 768px) {
      .cta-section__inner {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .cta-section__text {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 600px;
    }

    .cta-section__heading {
      font-family: var(--font-heading, 'Sora', sans-serif);
      font-size: clamp(1.5rem, 4vw, 2.25rem);
      font-weight: 700;
      color: var(--color-dark, #0f172a);
      margin: 0;
      line-height: 1.25;
    }

    .cta-section__sub {
      font-size: 1.0625rem;
      color: var(--color-text-muted, #64748b);
      margin: 0;
      line-height: 1.7;
    }

    .cta-section__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      flex-shrink: 0;
    }
  `],
})
export class CtaSectionComponent {
  readonly config = input.required<CtaConfig>();
}
