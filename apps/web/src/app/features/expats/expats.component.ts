import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SectionRendererComponent } from '@outtask/content';
import { SeoService } from '../../core/services/seo.service';
import { SectionType } from '@outtask/shared-types';
import type { PageSection } from '@outtask/shared-types';

@Component({
  selector: 'app-expats',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionRendererComponent],
  template: `<lib-section-renderer [sections]="sections" />`,
})
export class ExpatsComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly sections: PageSection[] = (() => {
    const now = new Date().toISOString();
    return [
      {
        id: 'e1', pageId: 'expats', type: SectionType.HERO, order: 0,
        config: {
          headline: 'Your IT career in the Netherlands starts here',
          subheadline: 'Relocating to the Netherlands? We help international IT professionals find great jobs, settle in, and thrive in the Dutch tech scene.',
          primaryCta: { label: 'Find opportunities', href: '/en/vacancies' },
          secondaryCta: { label: 'Talk to us', href: '/en/contact' },
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'e2', pageId: 'expats', type: SectionType.CARDS, order: 1,
        config: {
          eyebrow: 'How we help',
          heading: 'Dedicated support for international IT talent',
          columns: 3,
          cards: [
            { icon: '🎯', title: 'Job matching', description: 'We match your skills with companies open to hiring international talent — including visa-sponsored roles.' },
            { icon: '📄', title: 'Visa & permit guidance', description: 'We guide you through the highly skilled migrant visa process and work with our relocation partners.' },
            { icon: '🏠', title: 'Settling in support', description: 'From opening a Dutch bank account to finding housing — we connect you with trusted services.' },
            { icon: '🌐', title: 'English-first companies', description: 'We work with companies where English is the primary language, so you can hit the ground running.' },
            { icon: '💰', title: '30% ruling advice', description: 'Many international hires qualify for the Dutch 30% ruling tax benefit. We help you understand eligibility.' },
            { icon: '🤝', title: 'Ongoing support', description: 'We stay in touch after placement to make sure you\'re settled and thriving.' },
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'e3', pageId: 'expats', type: SectionType.FAQ, order: 2,
        config: {
          heading: 'Common questions from international candidates',
          items: [
            { question: 'Do I need to speak Dutch to work in the Netherlands?', answer: 'Not for most IT roles. The Dutch tech industry largely operates in English. Our client companies are English-speaking environments.' },
            { question: 'What is the highly skilled migrant visa?', answer: 'It\'s a fast-track work permit for non-EU nationals with a qualifying salary (currently €60,000+/year for most ages). Many IT roles qualify. We help you navigate the process.' },
            { question: 'How long does relocation take from offer to start?', answer: 'Typically 6-10 weeks once you have a job offer. The IND (Dutch immigration service) usually processes highly skilled migrant applications within 2-4 weeks.' },
            { question: 'Can Outtask help me find housing?', answer: 'We partner with relocation agencies and can refer you to trusted services for temporary and permanent housing in Amsterdam and other cities.' },
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'e4', pageId: 'expats', type: SectionType.CTA, order: 3,
        config: {
          heading: 'Ready to make the move?',
          subheading: 'Let\'s talk about your experience and find the right opportunity in the Netherlands.',
          style: 'brand',
          primaryCta: { label: 'Get in touch', href: '/en/contact' },
        },
        createdAt: now, updatedAt: now,
      },
    ] satisfies PageSection[];
  })();

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Expats — IT Careers in the Netherlands',
      description: 'International IT professional looking to work in the Netherlands? Outtask helps expats find IT jobs and navigate relocation, visas, and settling in.',
    });
  }
}
