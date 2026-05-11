import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { LogoCloudConfig } from '@outtask/shared-types';

@Component({
  selector: 'lib-logo-cloud-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <section class="logo-cloud section--sm">
      <div class="container">
        @if (config().heading) {
          <p class="logo-cloud__heading">{{ config().heading }}</p>
        }
        <div class="logo-cloud__grid">
          @for (logo of config().logos; track logo.name) {
            @if (logo.href) {
              <a [href]="logo.href" class="logo-cloud__logo" target="_blank" rel="noopener noreferrer" [attr.aria-label]="logo.name">
                <img [src]="logo.image" [alt]="logo.name" loading="lazy" />
              </a>
            } @else {
              <div class="logo-cloud__logo">
                <img [src]="logo.image" [alt]="logo.name" loading="lazy" />
              </div>
            }
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .logo-cloud {
      padding-block: 3rem;
      background-color: var(--color-bg-alt, #f8fafc);
    }

    .logo-cloud__heading {
      text-align: center;
      font-size: 0.8125rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-muted, #64748b);
      margin-bottom: 2rem;
    }

    .logo-cloud__grid {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 2rem 3rem;
    }

    .logo-cloud__logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      opacity: 0.5;
      transition: opacity 0.25s ease, filter 0.25s ease;
      filter: grayscale(100%);
      text-decoration: none;

      &:hover {
        opacity: 1;
        filter: grayscale(0%);
      }

      img {
        max-height: 100%;
        max-width: 120px;
        object-fit: contain;
      }
    }
  `],
})
export class LogoCloudSectionComponent {
  readonly config = input.required<LogoCloudConfig>();
}
