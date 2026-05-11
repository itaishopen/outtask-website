import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '@outtask/data-access';
import type { Vacancy, VacancyListConfig } from '@outtask/shared-types';
import { VacancyCardComponent } from '@outtask/ui';

@Component({
  selector: 'lib-vacancy-list-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, VacancyCardComponent],
  template: `
    <section class="vacancy-list-section section bg-alt">
      <div class="container">
        @if (config().heading) {
          <div class="section-header section-header--center">
            <h2 class="section-title">{{ config().heading }}</h2>
          </div>
        }

        @if (loading()) {
          <div class="vacancy-list-section__grid">
            @for (_ of [1,2,3]; track $index) {
              <div class="vacancy-list-section__skeleton">
                <div class="skeleton" style="height:1.5rem;width:70%;margin-bottom:0.75rem"></div>
                <div class="skeleton" style="height:1rem;width:40%;margin-bottom:0.5rem"></div>
                <div class="skeleton" style="height:1rem;width:30%"></div>
              </div>
            }
          </div>
        } @else if (error()) {
          <p class="text-muted text-center">Could not load vacancies at this time.</p>
        } @else if (vacancies().length === 0) {
          <div class="empty-state">
            <p class="empty-state__title">No open positions right now</p>
            <p class="empty-state__message">Check back soon — we're always growing.</p>
          </div>
        } @else {
          <div class="vacancy-list-section__grid">
            @for (v of vacancies(); track v.id) {
              <lib-vacancy-card [vacancy]="v" />
            }
          </div>
          <div class="vacancy-list-section__footer">
            <a routerLink="/en/vacancies" class="btn btn-outline">View all vacancies</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .vacancy-list-section { padding-block: 5rem; background-color: var(--color-bg-alt, #f8fafc); }

    .vacancy-list-section__grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    @media (min-width: 640px) {
      .vacancy-list-section__grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (min-width: 1024px) {
      .vacancy-list-section__grid { grid-template-columns: repeat(3, 1fr); }
    }

    .vacancy-list-section__skeleton {
      padding: 1.5rem;
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-md, 12px);
      background: var(--color-bg, #fff);
    }

    .vacancy-list-section__footer {
      display: flex;
      justify-content: center;
      margin-top: 2.5rem;
    }

    .skeleton {
      background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
      display: block;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class VacancyListSectionComponent implements OnInit {
  readonly config = input.required<VacancyListConfig>();

  private readonly api = inject(PublicApiService);

  readonly vacancies = signal<Vacancy[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    const cfg = this.config();
    this.api
      .getVacancies({ department: cfg.department }, 1, cfg.limit ?? 6)
      .subscribe({
        next: (res) => {
          this.vacancies.set(res.data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
