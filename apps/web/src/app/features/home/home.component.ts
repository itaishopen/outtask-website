import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { PublicApiService } from '@outtask/data-access';
import { SectionRendererComponent } from '@outtask/content';
import { SeoService } from '../../core/services/seo.service';
import { SectionType } from '@outtask/shared-types';
import type { PageSection } from '@outtask/shared-types';

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

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Outtask — IT Staffing & Nearshoring Partner',
      description:
        'Outtask connects ambitious companies with top IT talent. IT staffing, nearshoring, and expert developer placement in the Netherlands and beyond.',
    });

    this.api.getPage('home').subscribe({
      next: (page) => {
        if (page.seoTitle || page.seoDesc) {
          this.seo.setPage({
            title: page.seoTitle ?? page.title,
            description: page.seoDesc ?? undefined,
            image: page.ogImage ?? undefined,
          });
        }
        this.sections.set(page.sections);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.sections.set(this.getFallbackSections());
      },
    });
  }

  private getFallbackSections(): PageSection[] {
    const now = new Date().toISOString();
    return [
      {
        id: 'hero-fallback',
        pageId: 'home',
        type: SectionType.HERO,
        order: 0,
        config: {
          headline: 'Connecting ambitious companies with top IT talent',
          subheadline:
            'We help fast-growing companies in the Netherlands find skilled IT professionals — through staffing, nearshoring, and expert placement.',
          primaryCta: { label: 'Hire a Developer', href: '/en/hire-a-developer' },
          secondaryCta: { label: 'View Vacancies', href: '/en/vacancies' },
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'services-fallback',
        pageId: 'home',
        type: SectionType.CARDS,
        order: 1,
        config: {
          eyebrow: 'What we do',
          heading: 'Our Services',
          columns: 3,
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
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'cta-fallback',
        pageId: 'home',
        type: SectionType.CTA,
        order: 2,
        config: {
          heading: 'Ready to grow your team?',
          subheading: 'Schedule a free introductory call with our team today.',
          style: 'brand',
          primaryCta: { label: 'Schedule a meeting', href: '/en/contact' },
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'vacancies-fallback',
        pageId: 'home',
        type: SectionType.VACANCY_LIST,
        order: 3,
        config: {
          heading: 'Open Positions',
          limit: 6,
          showFilters: false,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'blog-fallback',
        pageId: 'home',
        type: SectionType.BLOG_LIST,
        order: 4,
        config: {
          heading: 'Latest Insights',
          limit: 3,
          showViewAll: true,
        },
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
}
