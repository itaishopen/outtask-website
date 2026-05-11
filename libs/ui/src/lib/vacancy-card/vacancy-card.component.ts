import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Vacancy } from '@outtask/shared-types';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'lib-vacancy-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="vacancy-card" data-testid="vacancy-card">
      <a [routerLink]="['/en/vacancies', vacancy().slug]" class="vacancy-card__link">
        <div class="vacancy-card__header">
          <h3 class="vacancy-card__title">{{ vacancy().title }}</h3>
          @if (vacancy().department) {
            <lib-badge>{{ vacancy().department }}</lib-badge>
          }
        </div>
        <div class="vacancy-card__meta">
          @if (vacancy().location) {
            <span class="vacancy-card__meta-item">
              <span class="vacancy-card__icon" aria-hidden="true">📍</span>
              {{ vacancy().location }}
            </span>
          }
          @if (vacancy().employmentType) {
            <span class="vacancy-card__meta-item">
              <span class="vacancy-card__icon" aria-hidden="true">⏱</span>
              {{ vacancy().employmentType }}
            </span>
          }
          @if (vacancy().seniority) {
            <span class="vacancy-card__meta-item">
              <span class="vacancy-card__icon" aria-hidden="true">🎯</span>
              {{ vacancy().seniority }}
            </span>
          }
        </div>
        <span class="vacancy-card__cta" aria-label="View {{ vacancy().title }} details">
          View details →
        </span>
      </a>
    </article>
  `,
  styles: [`
    .vacancy-card {
      background: var(--color-bg, #fff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-md, 12px);
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md, 0 4px 20px rgba(0,0,0,0.08));
        border-color: var(--color-primary, #2563eb);
      }

      &__link {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1.5rem;
        text-decoration: none;
        color: inherit;
        height: 100%;
      }

      &__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
      }

      &__title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-dark, #0f172a);
        line-height: 1.4;
        margin: 0;
      }

      &__meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1rem;
      }

      &__meta-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.875rem;
        color: var(--color-text-muted, #64748b);
      }

      &__icon {
        font-size: 0.875rem;
      }

      &__cta {
        margin-top: auto;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-primary, #2563eb);
        transition: gap 0.2s ease;
      }
    }
  `],
})
export class VacancyCardComponent {
  vacancy = input.required<Vacancy>();
}
