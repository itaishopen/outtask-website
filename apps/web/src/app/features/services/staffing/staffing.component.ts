import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SectionRendererComponent } from '@outtask/content';
import { SeoService } from '../../../core/services/seo.service';
import { SectionType } from '@outtask/shared-types';
import type { PageSection } from '@outtask/shared-types';

@Component({
  selector: 'app-staffing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionRendererComponent],
  template: `<lib-section-renderer [sections]="sections" />`,
})
export class StaffingComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly sections: PageSection[] = (() => {
    const now = new Date().toISOString();
    return [
      {
        id: 's1', pageId: 'staffing', type: SectionType.HERO, order: 0,
        config: {
          headline: 'IT Staffing that scales with your business',
          subheadline: 'We connect you with pre-vetted IT professionals — from frontend developers to DevOps engineers — on a contract or permanent basis.',
          primaryCta: { label: 'Talk to us', href: '/en/contact' },
          secondaryCta: { label: 'View open roles', href: '/en/vacancies' },
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 's2', pageId: 'staffing', type: SectionType.TEXT_IMAGE, order: 1,
        config: {
          eyebrow: 'How it works',
          heading: 'Your dedicated hiring partner',
          body: 'We take time to understand your tech stack, culture, and goals. Then we do the heavy lifting — sourcing, screening, and presenting only candidates who are a true fit. You save time and make better hires.',
          imagePosition: 'right',
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 's3', pageId: 'staffing', type: SectionType.CARDS, order: 2,
        config: {
          eyebrow: 'Our process',
          heading: 'From requirement to hire in weeks, not months',
          columns: 3,
          cards: [
            { icon: '🎯', title: '1. Intake', description: 'We deep-dive into your team, culture, and technical requirements to define the ideal profile.' },
            { icon: '🔍', title: '2. Search', description: 'Our sourcing team leverages our network, job boards, and proactive headhunting to find the best candidates.' },
            { icon: '✅', title: '3. Screen', description: 'We interview and assess candidates on technical skills, soft skills, and culture fit before presenting them.' },
            { icon: '🤝', title: '4. Present', description: 'You receive a curated shortlist of top candidates — typically 3-5 profiles within 1-2 weeks.' },
            { icon: '🚀', title: '5. Place', description: 'We handle negotiations, onboarding, and ensure a smooth transition for both candidate and client.' },
            { icon: '📊', title: '6. Follow-up', description: 'We check in regularly to ensure satisfaction and address any concerns early on.' },
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 's4', pageId: 'staffing', type: SectionType.CTA, order: 3,
        config: {
          heading: 'Ready to find your next IT hire?',
          subheading: 'Talk to our team and we\'ll have candidates ready within 2 weeks.',
          style: 'brand',
          primaryCta: { label: 'Schedule a call', href: '/en/contact' },
        },
        createdAt: now, updatedAt: now,
      },
    ] satisfies PageSection[];
  })();

  ngOnInit(): void {
    this.seo.setPage({
      title: 'IT Staffing Services',
      description: 'Outtask provides expert IT staffing solutions in the Netherlands. We place developers, engineers, and tech specialists for contract and permanent roles.',
    });
  }
}
