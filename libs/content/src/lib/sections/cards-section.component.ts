import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CardsConfig } from '@outtask/shared-types';

@Component({
  selector: 'lib-cards-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="cards-section section">
      <div class="container">
        @if (config().heading || config().eyebrow) {
          <div class="section-header section-header--center">
            @if (config().eyebrow) {
              <span class="eyebrow">{{ config().eyebrow }}</span>
            }
            @if (config().heading) {
              <h2 class="section-title">{{ config().heading }}</h2>
            }
          </div>
        }
        <div
          class="cards-section__grid"
          [class.cards-section__grid--2]="config().columns === 2"
          [class.cards-section__grid--4]="config().columns === 4"
        >
          @for (card of config().cards; track card.title) {
            @if (card.href) {
              <a [routerLink]="card.href" class="cards-section__card">
                @if (card.icon) {
                  <div class="cards-section__icon" aria-hidden="true">{{ card.icon }}</div>
                }
                <h3 class="cards-section__card-title">{{ card.title }}</h3>
                <p class="cards-section__card-desc">{{ card.description }}</p>
              </a>
            } @else {
              <div class="cards-section__card">
                @if (card.icon) {
                  <div class="cards-section__icon" aria-hidden="true">{{ card.icon }}</div>
                }
                <h3 class="cards-section__card-title">{{ card.title }}</h3>
                <p class="cards-section__card-desc">{{ card.description }}</p>
              </div>
            }
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .cards-section { padding-block: 5rem; }

    .cards-section__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 640px) {
      .cards-section__grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (min-width: 1024px) {
      .cards-section__grid { grid-template-columns: repeat(3, 1fr); }
      .cards-section__grid--2 { grid-template-columns: repeat(2, 1fr); }
      .cards-section__grid--4 { grid-template-columns: repeat(4, 1fr); }
    }

    .cards-section__card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.75rem;
      text-decoration: none;
      color: inherit;
      border-radius: var(--radius-md, 12px);
      border: 1px solid var(--color-border, #e2e8f0);
      background-color: var(--color-bg, #fff);
      transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg, 0 10px 40px rgba(0,0,0,0.1));
        border-color: var(--color-primary, #2563eb);
      }
    }

    .cards-section__icon {
      font-size: 2rem;
      line-height: 1;
    }

    .cards-section__card-title {
      font-family: var(--font-heading, 'Sora', sans-serif);
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-dark, #0f172a);
      margin: 0;
    }

    .cards-section__card-desc {
      font-size: 0.9375rem;
      color: var(--color-text-muted, #64748b);
      line-height: 1.7;
      margin: 0;
    }
  `],
})
export class CardsSectionComponent {
  readonly config = input.required<CardsConfig>();
}
