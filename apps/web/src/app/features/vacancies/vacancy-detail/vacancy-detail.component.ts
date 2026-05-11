import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicApiService } from '@outtask/data-access';
import { SeoService } from '../../../core/services/seo.service';
import type { Vacancy } from '@outtask/shared-types';

@Component({
  selector: 'app-vacancy-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './vacancy-detail.component.html',
  styleUrl: './vacancy-detail.component.scss',
})
export class VacancyDetailComponent implements OnInit {
  // Bound via withComponentInputBinding()
  readonly slug = input.required<string>();

  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly vacancy = signal<Vacancy | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.api.getVacancy(this.slug()).subscribe({
      next: (v) => {
        this.vacancy.set(v);
        this.seo.setPage({
          title: `${v.title} — Outtask`,
          description: v.description?.substring(0, 160) ?? undefined,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  safe(html: string | null): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html ?? '');
  }
}
