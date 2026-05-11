import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnChanges,
  inject,
  input,
  signal,
  computed,
} from '@angular/core';
import { SectionRendererComponent } from '@outtask/content';
import { SeoService } from '../../core/services/seo.service';
import { SectionType } from '@outtask/shared-types';
import type { PageSection } from '@outtask/shared-types';

interface RoleConfig {
  title: string;
  headline: string;
  subheadline: string;
  description: string;
  skills: string[];
  seniorities: string[];
}

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  'react-developer': {
    title: 'React Developer',
    headline: 'Hire a senior React developer in the Netherlands',
    subheadline: 'We connect companies with experienced React engineers — from UI architects to full-stack developers.',
    description: 'React developers we place are proficient in hooks, context, Redux/Zustand, React Query, Next.js, and modern build tooling.',
    skills: ['React', 'TypeScript', 'Next.js', 'Redux / Zustand', 'React Query', 'Webpack / Vite', 'Testing Library'],
    seniorities: ['Mid-level', 'Senior', 'Lead'],
  },
  'angular-developer': {
    title: 'Angular Developer',
    headline: 'Hire an experienced Angular developer',
    subheadline: 'Enterprise-grade Angular engineers with deep TypeScript expertise. From component architecture to performance optimization.',
    description: 'Our Angular developers have hands-on experience with Angular 15+, RxJS, NgRx, and modern Angular SSR.',
    skills: ['Angular 17+', 'TypeScript', 'RxJS', 'NgRx', 'Angular Material', 'NX Monorepos', 'Karma / Jest'],
    seniorities: ['Mid-level', 'Senior', 'Lead'],
  },
  'java-developer': {
    title: 'Java Developer',
    headline: 'Hire a skilled Java backend developer',
    subheadline: 'Spring Boot specialists, microservices architects, and Java engineers for high-throughput systems.',
    description: 'Java developers we place specialize in Spring Boot, microservices, event-driven architecture, and cloud deployments.',
    skills: ['Java 17+', 'Spring Boot', 'Hibernate', 'Kafka / RabbitMQ', 'Docker', 'AWS / GCP', 'JUnit'],
    seniorities: ['Mid-level', 'Senior', 'Architect'],
  },
  'devops-engineer': {
    title: 'DevOps Engineer',
    headline: 'Hire a DevOps engineer to scale your platform',
    subheadline: 'Kubernetes specialists, CI/CD experts, and cloud platform engineers who keep your systems reliable and fast.',
    description: 'DevOps engineers we place have deep experience in container orchestration, cloud infrastructure, and developer experience.',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'GitHub Actions / Jenkins', 'AWS / GCP / Azure', 'Datadog / Grafana', 'Linux'],
    seniorities: ['Mid-level', 'Senior', 'Platform Lead'],
  },
  'python-developer': {
    title: 'Python Developer',
    headline: 'Hire a Python developer for backend or data',
    subheadline: 'Backend API developers, data engineers, and ML specialists with strong Python foundations.',
    description: 'Our Python developers work across FastAPI, Django, data pipelines, ML pipelines, and cloud infrastructure.',
    skills: ['Python 3.x', 'FastAPI / Django', 'SQLAlchemy', 'Pandas / NumPy', 'Airflow', 'PostgreSQL', 'Docker'],
    seniorities: ['Mid-level', 'Senior', 'Lead'],
  },
};

const DEFAULT_ROLE: RoleConfig = {
  title: 'Developer',
  headline: 'Hire a skilled developer through Outtask',
  subheadline: 'We place experienced developers across all modern tech stacks.',
  description: 'Tell us your specific requirements and we\'ll find the right candidate.',
  skills: [],
  seniorities: ['Mid-level', 'Senior'],
};

@Component({
  selector: 'app-role-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionRendererComponent],
  template: `<lib-section-renderer [sections]="sections()" />`,
})
export class RoleLandingComponent implements OnInit, OnChanges {
  readonly role = input.required<string>();

  private readonly seo = inject(SeoService);

  readonly roleConfig = computed(() => ROLE_CONFIGS[this.role()] ?? DEFAULT_ROLE);

  readonly sections = computed<PageSection[]>(() => {
    const cfg = this.roleConfig();
    const now = new Date().toISOString();
    const pageId = `role-${this.role()}`;

    return [
      {
        id: `${pageId}-hero`, pageId, type: SectionType.HERO, order: 0,
        config: {
          headline: cfg.headline,
          subheadline: cfg.subheadline,
          primaryCta: { label: `Hire a ${cfg.title}`, href: '/en/contact' },
          secondaryCta: { label: 'See open vacancies', href: '/en/vacancies' },
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: `${pageId}-cards`, pageId, type: SectionType.CARDS, order: 1,
        config: {
          eyebrow: 'Expertise',
          heading: `What to expect from our ${cfg.title}s`,
          columns: 3,
          cards: [
            ...cfg.skills.map((skill) => ({
              icon: '✅',
              title: skill,
              description: `Hands-on experience with ${skill} in production environments.`,
            })),
          ],
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: `${pageId}-vacancy`, pageId, type: SectionType.VACANCY_LIST, order: 2,
        config: {
          heading: `Open ${cfg.title} positions`,
          limit: 6,
          showFilters: false,
        },
        createdAt: now, updatedAt: now,
      },
      {
        id: `${pageId}-cta`, pageId, type: SectionType.CTA, order: 3,
        config: {
          heading: `Looking for a ${cfg.title}?`,
          subheading: 'We\'ll have qualified candidates ready within 2 weeks. No upfront cost.',
          style: 'brand',
          primaryCta: { label: 'Start hiring', href: '/en/contact' },
        },
        createdAt: now, updatedAt: now,
      },
    ];
  });

  ngOnInit(): void {
    this.updateSeo();
  }

  ngOnChanges(): void {
    this.updateSeo();
  }

  private updateSeo(): void {
    const cfg = this.roleConfig();
    this.seo.setPage({
      title: `Hire a ${cfg.title} in the Netherlands`,
      description: cfg.subheadline,
    });
  }
}
