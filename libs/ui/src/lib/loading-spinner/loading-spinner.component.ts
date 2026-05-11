import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-loading-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="spinner-wrapper" [class.spinner-wrapper--fullpage]="fullPage()">
      <div class="spinner" role="status" [attr.aria-label]="label()">
        <div class="spinner__ring"></div>
      </div>
      @if (label()) {
        <p class="spinner__label">{{ label() }}</p>
      }
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      gap: 1rem;

      &--fullpage {
        min-height: 60vh;
      }
    }

    .spinner {
      width: 40px;
      height: 40px;

      &__ring {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 3px solid var(--color-border, #e2e8f0);
        border-top-color: var(--color-primary, #2563eb);
        animation: spin 0.8s linear infinite;
      }
    }

    .spinner__label {
      font-size: 0.9375rem;
      color: var(--color-text-muted, #64748b);
      margin: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class LoadingSpinnerComponent {
  label = input<string>('Loading...');
  fullPage = input<boolean>(false);
}
