import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '@outtask/data-access';
import { VacancyCardComponent } from '@outtask/ui';
import { SeoService } from '../../../core/services/seo.service';
import type { Vacancy } from '@outtask/shared-types';

@Component({
  selector: 'app-vacancy-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, VacancyCardComponent],
  templateUrl: './vacancy-list.component.html',
  styleUrl: './vacancy-list.component.scss',
})
export class VacancyListComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly vacancies = signal<Vacancy[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly selectedDepartment = signal('');
  readonly selectedEmploymentType = signal('');

  readonly departments = computed(() => {
    const deps = this.vacancies()
      .map((v) => v.department)
      .filter((d): d is string => !!d);
    return [...new Set(deps)].sort();
  });

  readonly employmentTypes = computed(() => {
    const types = this.vacancies()
      .map((v) => v.employmentType)
      .filter((t): t is string => !!t);
    return [...new Set(types)].sort();
  });

  readonly filtered = computed(() => {
    let list = this.vacancies();
    const dept = this.selectedDepartment();
    const type = this.selectedEmploymentType();
    if (dept) list = list.filter((v) => v.department === dept);
    if (type) list = list.filter((v) => v.employmentType === type);
    return list;
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Open Vacancies',
      description: 'Browse all open IT positions at Outtask. We place developers, engineers, and tech specialists across the Netherlands.',
    });

    this.api.getVacancies(undefined, 1, 100).subscribe({
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

  clearFilters(): void {
    this.selectedDepartment.set('');
    this.selectedEmploymentType.set('');
  }
}
