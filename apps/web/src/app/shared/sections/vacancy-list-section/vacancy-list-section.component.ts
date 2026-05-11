import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../../core/services/public-api.service';
import type { Vacancy, VacancyListSectionConfig } from '../../models/api.models';

@Component({
  selector: 'app-vacancy-list-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './vacancy-list-section.component.html',
  styleUrl: './vacancy-list-section.component.scss',
})
export class VacancyListSectionComponent implements OnInit {
  readonly config = input.required<VacancyListSectionConfig>();

  private readonly api = inject(PublicApiService);

  readonly vacancies = signal<Vacancy[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    const cfg = this.config();
    this.api
      .getVacancies({
        department: cfg.department,
        limit: cfg.limit ?? 6,
      })
      .subscribe({
        next: (res) => {
          this.vacancies.set(res.data.items);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
