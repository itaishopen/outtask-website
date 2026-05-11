import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="container not-found__content">
        <div class="not-found__code" aria-hidden="true">404</div>
        <h1 class="not-found__title">Page not found</h1>
        <p class="not-found__text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="not-found__actions">
          <a routerLink="/en" class="btn btn-primary btn--lg">Go to homepage</a>
          <a routerLink="/en/vacancies" class="btn btn-outline btn--lg">View vacancies</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      padding: 4rem 1.5rem;
    }

    .not-found__content {
      text-align: center;
      max-width: 560px;
    }

    .not-found__code {
      font-family: var(--font-heading, 'Sora', sans-serif);
      font-size: clamp(5rem, 20vw, 10rem);
      font-weight: 800;
      color: var(--color-border);
      line-height: 1;
      margin-bottom: 1rem;
      user-select: none;
    }

    .not-found__title {
      font-family: var(--font-heading, 'Sora', sans-serif);
      font-size: clamp(1.75rem, 5vw, 2.5rem);
      font-weight: 700;
      color: var(--color-dark);
      margin-bottom: 1rem;
    }

    .not-found__text {
      font-size: 1.0625rem;
      color: var(--color-text-muted);
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .not-found__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }
  `],
})
export class NotFoundComponent {}
