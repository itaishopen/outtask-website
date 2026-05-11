import { Component, input, ChangeDetectionStrategy } from '@angular/core';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'lib-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [class]="'badge--' + variant()">
      <ng-content />
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;

      &--default {
        background: var(--color-bg-alt, #f8fafc);
        color: var(--color-text-muted, #64748b);
        border: 1px solid var(--color-border, #e2e8f0);
      }

      &--success {
        background: #dcfce7;
        color: #166534;
      }

      &--warning {
        background: #fef3c7;
        color: #92400e;
      }

      &--danger {
        background: #fee2e2;
        color: #991b1b;
      }

      &--info {
        background: #dbeafe;
        color: #1e40af;
      }
    }
  `],
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');
}
