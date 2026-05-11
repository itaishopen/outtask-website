import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SectionRendererComponent } from '@outtask/content';
import { SeoService } from '../../core/services/seo.service';
import { SectionType } from '@outtask/shared-types';
import type { PageSection } from '@outtask/shared-types';

@Component({
  selector: 'app-working-at-outtask',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionRendererComponent],
  template: `<lib-section-renderer [sections]="sections" />`,
})
export class WorkingAtOuttaskComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly sections: PageSection[] = (() => {
    const now = new Date().toISOString();
    return [
      {
        id: 'w1', pageId: 'working-at-outtask', type: SectionType.HERO, order: 0,
        config: {
          headline: 'Build your career at Outtask',
          subheadline: 'We\'re a passionate team connecting IT talent with great companies. If you love people, tech, and making things happen — you\'ll fit right in.',
          primaryCta: { label: 'View open roles', href: '/en/vacancies' },
          secondaryCta: { label: 'Meet the team', href: '/en/happy-people' },
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'w2', pageId: 'working-at-outtask', type: SectionType.CARDS, order: 1,
        config: {
          eyebrow: 'Our culture',
          heading: 'What makes Outtask a great place to work',
          columns: 3,
          cards: [
            { icon: '🚀', title: 'Impact from day one', description: 'You\'ll own your work and see the direct impact of your efforts on our clients and candidates.' },
            { icon: '🤝', title: 'Collaborative team', description: 'We believe great results come from open communication, shared knowledge, and celebrating wins together.' },
            { icon: '📈', title: 'Room to grow', description: 'Whether you want to specialize or lead, we invest in your development with training, mentoring, and clear paths.' },
            { icon: '⚡', title: 'Move fast', description: 'We\'re a startup at heart — decisions get made quickly, ideas get tested, and great work gets recognized.' },
            { icon: '🌍', title: 'International exposure', description: 'Work with companies and talent from across Europe and gain a true international perspective.' },
            { icon: '😊', title: 'Work-life harmony', description: 'Flexible hours, remote options, and a team that respects your time outside of work.' },
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'w3', pageId: 'working-at-outtask', type: SectionType.TESTIMONIALS, order: 2,
        config: {
          heading: 'What our team says',
          testimonials: [
            { quote: 'I joined Outtask two years ago as a junior recruiter. The growth opportunities are real — I now lead a team of four and work on our most strategic accounts.', author: 'Martijn V.', title: 'Team Lead', company: 'Outtask' },
            { quote: 'What I love most is the autonomy. You\'re trusted to do your job and given the tools to do it well. No micromanagement, just support when you need it.', author: 'Sophie K.', title: 'Senior Talent Partner', company: 'Outtask' },
            { quote: 'The team culture here is unlike any agency I\'ve worked at. We actually care about placing people in jobs they love, not just hitting targets.', author: 'Daan B.', title: 'Account Manager', company: 'Outtask' },
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: 'w4', pageId: 'working-at-outtask', type: SectionType.VACANCY_LIST, order: 3,
        config: { heading: 'Open positions at Outtask', limit: 6 },
        createdAt: now, updatedAt: now,
      },
    ] satisfies PageSection[];
  })();

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Working at Outtask',
      description: 'Discover what it\'s like to work at Outtask — a fast-growing IT staffing company in Amsterdam. See our culture, values, and open roles.',
    });
  }
}
