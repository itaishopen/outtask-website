import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SectionRendererComponent } from '@outtask/content';
import { SeoService } from '../../core/services/seo.service';
import { SectionType } from '@outtask/shared-types';
import type { PageSection } from '@outtask/shared-types';

@Component({
  selector: 'app-happy-people',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionRendererComponent],
  template: `<lib-section-renderer [sections]="sections" />`,
})
export class HappyPeopleComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly sections: PageSection[] = (() => {
    const now = new Date().toISOString();
    return [
      {
        id: 'hp1', pageId: 'happy-people', type: SectionType.HERO, order: 0,
        config: {
          headline: 'Happy candidates, happy clients',
          subheadline: 'We measure our success by the satisfaction of the people we place and the teams we help build. Here\'s what they say.',
          primaryCta: { label: 'Join them', href: '/en/vacancies' },
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'hp2', pageId: 'happy-people', type: SectionType.TESTIMONIALS, order: 1,
        config: {
          heading: 'Stories from our community',
          testimonials: [
            {
              quote: 'Outtask found me a role that I would have never discovered on my own. They understood what I was looking for and matched me perfectly.',
              author: 'Lars de Vries',
              title: 'Senior Frontend Developer',
              company: 'Placed at TechCorp NL',
            },
            {
              quote: 'I relocated from Poland to Amsterdam with Outtask\'s help. The support with the visa process and finding an apartment was invaluable.',
              author: 'Karolina Nowak',
              title: 'Backend Developer',
              company: 'Placed at ScaleUp BV',
            },
            {
              quote: 'We\'ve hired 4 developers through Outtask in the last year. Every single placement was a strong fit — technically and culturally.',
              author: 'Joep Smits',
              title: 'CTO',
              company: 'FinTech Startup',
            },
            {
              quote: 'As a freelancer, I appreciate that Outtask treats me as a partner, not just a product. They always have interesting projects ready.',
              author: 'Tobias H.',
              title: 'DevOps Engineer',
              company: 'Freelance via Outtask',
            },
            {
              quote: 'The team is genuinely invested in finding the right match. They didn\'t just send me a job description — they prepared me for every step.',
              author: 'Nina M.',
              title: 'Data Engineer',
              company: 'Placed at Analytics Co',
            },
            {
              quote: 'Outtask saved us months of recruiting. Within 3 weeks we had interviewed 5 great candidates and made 2 hires.',
              author: 'Bart K.',
              title: 'VP Engineering',
              company: 'SaaS company',
            },
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'hp3', pageId: 'happy-people', type: SectionType.CTA, order: 2,
        config: {
          heading: 'Ready to be our next success story?',
          subheading: 'Whether you\'re looking for your next role or your next hire, we\'d love to help.',
          style: 'brand',
          primaryCta: { label: 'Get started', href: '/en/contact' },
          secondaryCta: { label: 'View vacancies', href: '/en/vacancies' },
        },
        createdAt: now, updatedAt: now,
      },
    ] satisfies PageSection[];
  })();

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Happy People — Testimonials',
      description: 'Read success stories from candidates and companies Outtask has helped. Real testimonials from developers, engineers, and tech leaders.',
    });
  }
}
