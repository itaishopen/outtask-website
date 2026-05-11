import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { PublicApiService } from '../../core/services/public-api.service';
import { SeoService } from '../../core/services/seo.service';
import { SectionRendererComponent } from '../../shared/sections/section-renderer.component';
import type { PageSection } from '../../shared/models/api.models';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionRendererComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly sections = signal<PageSection[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Outtask — IT Staffing & Nearshoring Partner',
      description:
        'Outtask connects ambitious companies with top IT talent. IT staffing, nearshoring, and expert developer placement in the Netherlands and beyond.',
    });

    this.api.getPage('home').subscribe({
      next: (res) => {
        if (res.data.seo) {
          this.seo.setPage({
            title: res.data.seo.title ?? res.data.title,
            description: res.data.seo.description,
            image: res.data.seo.image,
          });
        }
        this.sections.set(res.data.sections);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        // Show fallback static sections on API error
        this.sections.set(this.getFallbackSections());
      },
    });
  }

  private getFallbackSections(): PageSection[] {
    return [
      {
        id: 'hero-fallback',
        type: 'hero',
        config: {
          headline: 'Connecting ambitious companies with top IT talent',
          subheadline:
            'We help fast-growing companies in the Netherlands find skilled IT professionals — through staffing, nearshoring, and expert placement.',
          badge: 'Trusted IT Partner',
          ctas: [
            { label: 'Hire a Developer', href: '/en/hire-a-developer', variant: 'primary' },
            { label: 'View Vacancies', href: '/en/vacancies', variant: 'outline-white' },
          ],
        },
      },
      {
        id: 'services-fallback',
        type: 'cards',
        config: {
          eyebrow: 'What we do',
          heading: 'Our Services',
          subtitle: 'End-to-end IT talent solutions for modern companies.',
          centeredHeader: true,
          cards: [
            {
              icon: '🧑‍💻',
              title: 'IT Staffing',
              description:
                'We match your company with experienced IT professionals on a contract or permanent basis.',
              href: '/en/services/staffing',
            },
            {
              icon: '🌍',
              title: 'Nearshoring',
              description:
                'Build high-performing remote teams in European time zones — cost-effective and culturally aligned.',
              href: '/en/services/nearshoring',
            },
            {
              icon: '🚀',
              title: 'Hire a Developer',
              description:
                'Looking for a specific tech role? We specialise in placing React, Angular, Java, and DevOps engineers.',
              href: '/en/hire-a-developer',
            },
          ],
          columns: 3,
        },
      },
      {
        id: 'cta-fallback',
        type: 'cta',
        config: {
          heading: 'Ready to grow your team?',
          subheading: 'Schedule a free introductory call with our team today.',
          variant: 'brand',
          ctas: [
            { label: 'Schedule a meeting', href: '/en/contact', variant: 'outline-white' },
          ],
        },
      },
      {
        id: 'vacancies-fallback',
        type: 'vacancy-list',
        config: {
          heading: 'Open Positions',
          subtitle: 'Join a fast-growing team or help us place the right candidates.',
          limit: 6,
          showViewAll: true,
        },
      },
      {
        id: 'blog-fallback',
        type: 'blog-list',
        config: {
          heading: 'Latest Insights',
          subtitle: 'Stay up to date with trends in IT staffing and tech hiring.',
          limit: 3,
          showViewAll: true,
        },
      },
    ];
  }
}
