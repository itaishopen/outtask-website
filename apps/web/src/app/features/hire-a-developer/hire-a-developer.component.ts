import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SectionRendererComponent } from '@outtask/content';
import { SeoService } from '../../core/services/seo.service';
import { SectionType } from '@outtask/shared-types';
import type { PageSection } from '@outtask/shared-types';

@Component({
  selector: 'app-hire-a-developer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionRendererComponent],
  template: `<lib-section-renderer [sections]="sections" />`,
})
export class HireADeveloperComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly sections: PageSection[] = (() => {
    const now = new Date().toISOString();
    return [
      {
        id: 'hd1', pageId: 'hire', type: SectionType.HERO, order: 0,
        config: {
          headline: 'Hire a skilled developer — fast',
          subheadline: 'We specialize in placing experienced developers for contract and permanent roles. Tell us what you need and we\'ll have candidates within 2 weeks.',
          primaryCta: { label: 'Hire now', href: '/en/contact' },
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'hd2', pageId: 'hire', type: SectionType.CARDS, order: 1,
        config: {
          eyebrow: 'Roles we place',
          heading: 'Find the right developer for your stack',
          columns: 3,
          cards: [
            { icon: '⚛️', title: 'React Developer', description: 'Frontend engineers with deep React experience, from hooks to Next.js.', href: '/en/roles/react-developer' },
            { icon: '🅰️', title: 'Angular Developer', description: 'Enterprise-grade Angular developers with TypeScript expertise.', href: '/en/roles/angular-developer' },
            { icon: '☕', title: 'Java Developer', description: 'Backend developers with Spring Boot, microservices, and cloud experience.', href: '/en/roles/java-developer' },
            { icon: '🔧', title: 'DevOps Engineer', description: 'Infrastructure and platform engineers skilled in Kubernetes, CI/CD, and cloud.', href: '/en/roles/devops-engineer' },
            { icon: '🐍', title: 'Python Developer', description: 'Python engineers for data, backend APIs, and ML/AI pipelines.', href: '/en/roles/python-developer' },
            { icon: '💬', title: 'Other roles', description: 'Don\'t see your role? We cover the full stack. Tell us what you need.', href: '/en/contact' },
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'hd3', pageId: 'hire', type: SectionType.TEXT_IMAGE, order: 2,
        config: {
          eyebrow: 'Our guarantee',
          heading: 'Developers who hit the ground running',
          body: 'We don\'t just match CVs. Every developer we place is assessed for technical depth, communication skills, and cultural fit. Most placements are productive within their first week. If it doesn\'t work out within 30 days, we find a replacement — no questions asked.',
          imagePosition: 'left',
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'hd4', pageId: 'hire', type: SectionType.CTA, order: 3,
        config: {
          heading: 'Tell us who you\'re looking for',
          subheading: 'Fill in a quick form or schedule a 30-minute call. We\'ll get back to you same day.',
          style: 'brand',
          primaryCta: { label: 'Hire a developer', href: '/en/contact' },
        },
        createdAt: now, updatedAt: now,
      },
    ] satisfies PageSection[];
  })();

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Hire a Developer',
      description: 'Hire experienced React, Angular, Java, Python, and DevOps engineers through Outtask. Fast placement, no-risk guarantee.',
    });
  }
}
