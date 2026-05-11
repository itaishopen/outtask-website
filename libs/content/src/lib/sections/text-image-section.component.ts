import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TextImageConfig } from '@outtask/shared-types';

@Component({
  selector: 'lib-text-image-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="text-image section">
      <div class="container">
        <div class="text-image__grid" [class.text-image__grid--reversed]="config().imagePosition === 'left'">
          <div class="text-image__text">
            @if (config().eyebrow) {
              <span class="eyebrow">{{ config().eyebrow }}</span>
            }
            <h2 class="text-image__heading">{{ config().heading }}</h2>
            <p class="text-image__body">{{ config().body }}</p>
            @if (config().cta) {
              <a [routerLink]="config().cta!.href" class="btn btn-primary">
                {{ config().cta!.label }}
              </a>
            }
          </div>
          <div class="text-image__media">
            @if (config().image) {
              <img
                class="text-image__image"
                [src]="config().image!"
                [alt]="config().imageAlt ?? ''"
                loading="lazy"
              />
            } @else {
              <div class="text-image__placeholder" aria-hidden="true"></div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .text-image {
      padding-block: 5rem;
    }

    .text-image__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      align-items: center;
    }

    @media (min-width: 768px) {
      .text-image__grid {
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
      }

      .text-image__grid--reversed .text-image__text { order: 2; }
      .text-image__grid--reversed .text-image__media { order: 1; }
    }

    .text-image__text {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      align-items: flex-start;
    }

    .text-image__heading {
      font-family: var(--font-heading, 'Sora', sans-serif);
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 700;
      color: var(--color-dark, #0f172a);
      line-height: 1.2;
      margin: 0;
    }

    .text-image__body {
      color: var(--color-text-muted, #64748b);
      line-height: 1.8;
      font-size: 1.0625rem;
      margin: 0;
    }

    .text-image__image {
      width: 100%;
      border-radius: var(--radius-lg, 20px);
      object-fit: cover;
      aspect-ratio: 4 / 3;
      box-shadow: var(--shadow-lg, 0 10px 40px rgba(0,0,0,0.1));
    }

    .text-image__placeholder {
      width: 100%;
      aspect-ratio: 4 / 3;
      border-radius: var(--radius-lg, 20px);
      background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
    }
  `],
})
export class TextImageSectionComponent {
  readonly config = input.required<TextImageConfig>();
}
