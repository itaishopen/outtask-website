import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SectionRendererComponent } from '@outtask/content';
import { SeoService } from '../../../core/services/seo.service';
import { SectionType } from '@outtask/shared-types';
import type { PageSection } from '@outtask/shared-types';

@Component({
  selector: 'app-nearshoring',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionRendererComponent],
  template: `<lib-section-renderer [sections]="sections" />`,
})
export class NearshoringComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly sections: PageSection[] = (() => {
    const now = new Date().toISOString();
    return [
      {
        id: 'n1', pageId: 'nearshoring', type: SectionType.HERO, order: 0,
        config: {
          headline: 'Build world-class remote teams in your timezone',
          subheadline: 'Nearshoring with Outtask means getting top engineering talent from European markets — with real cultural alignment, overlapping work hours, and no communication overhead.',
          primaryCta: { label: 'Get started', href: '/en/contact' },
          secondaryCta: { label: 'Learn more', href: '#how-it-works' },
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'n2', pageId: 'nearshoring', type: SectionType.TEXT_IMAGE, order: 1,
        config: {
          eyebrow: 'Why nearshoring',
          heading: 'The smart alternative to offshore outsourcing',
          body: 'Traditional offshore outsourcing often leads to timezone frustrations, communication gaps, and quality issues. Nearshoring solves this — same time zone, compatible culture, and direct communication. You get the cost benefits of remote talent without the usual trade-offs.',
          imagePosition: 'right',
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'n3', pageId: 'nearshoring', type: SectionType.CARDS, order: 2,
        config: {
          eyebrow: 'Benefits',
          heading: 'Why companies choose Outtask for nearshoring',
          columns: 3,
          cards: [
            { icon: '🌍', title: 'European talent pools', description: 'Access top developers from Poland, Portugal, Romania, and more — all within 1-2 hour time zones of Amsterdam.' },
            { icon: '💬', title: 'Seamless communication', description: 'Overlapping working hours mean real-time collaboration, no async bottlenecks.' },
            { icon: '💡', title: 'Technical excellence', description: 'We source only senior and mid-level engineers with proven track records at scale.' },
            { icon: '💰', title: 'Cost effective', description: 'Reduce hiring costs by 30-50% compared to local hires without sacrificing quality.' },
            { icon: '🔒', title: 'GDPR compliant', description: 'All our near-shore partners operate within the EU, making compliance straightforward.' },
            { icon: '🤝', title: 'Fully managed', description: 'We handle contracts, HR, and team management so you can focus on building your product.' },
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'n4', pageId: 'nearshoring', type: SectionType.FAQ, order: 3,
        config: {
          heading: 'Frequently asked questions',
          items: [
            { question: 'Which countries do you source nearshore talent from?', answer: 'We work with developers primarily based in Poland, Portugal, Romania, Spain, and the Czech Republic — all within 1-2 hours of Amsterdam.' },
            { question: 'How long does it take to build a nearshore team?', answer: 'Typically 4-8 weeks from first conversation to having engineers onboarded and productive.' },
            { question: 'Who manages the nearshore team day-to-day?', answer: 'You have full control over the work. We handle the HR, contracts, and administrative side. Your tech leads manage the actual engineering work.' },
            { question: 'What tech stacks do you cover?', answer: 'React, Angular, Vue, Node.js, Java, Python, .NET, DevOps (AWS/GCP/Azure), and more. Tell us what you need and we\'ll find the right profile.' },
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'n5', pageId: 'nearshoring', type: SectionType.CTA, order: 4,
        config: {
          heading: 'Scale your team with nearshore talent',
          subheading: 'Let\'s talk about your engineering needs. We\'ll design a nearshoring setup that works for your team.',
          style: 'brand',
          primaryCta: { label: 'Start the conversation', href: '/en/contact' },
        },
        createdAt: now, updatedAt: now,
      },
    ] satisfies PageSection[];
  })();

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Nearshoring Services',
      description: 'Build high-performing remote engineering teams with Outtask nearshoring. Access top European tech talent in your timezone.',
    });
  }
}
