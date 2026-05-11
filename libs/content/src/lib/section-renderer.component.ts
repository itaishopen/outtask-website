import {
  Component,
  input,
  ChangeDetectionStrategy,
  Type,
  OnInit,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgComponentOutlet } from '@angular/common';
import { PageSection, SectionType } from '@outtask/shared-types';

// Section component interface — all section components implement this
export interface SectionComponent {
  config: unknown;
}

// Registry of section type → component class
// Components are loaded lazily to keep the initial bundle small
const SECTION_LOADERS: Record<SectionType, () => Promise<Type<SectionComponent>>> = {
  [SectionType.HERO]: () =>
    import('./sections/hero-section.component').then((m) => m.HeroSectionComponent),
  [SectionType.TEXT_IMAGE]: () =>
    import('./sections/text-image-section.component').then((m) => m.TextImageSectionComponent),
  [SectionType.CARDS]: () =>
    import('./sections/cards-section.component').then((m) => m.CardsSectionComponent),
  [SectionType.TESTIMONIALS]: () =>
    import('./sections/testimonials-section.component').then(
      (m) => m.TestimonialsSectionComponent,
    ),
  [SectionType.CTA]: () =>
    import('./sections/cta-section.component').then((m) => m.CtaSectionComponent),
  [SectionType.RICH_TEXT]: () =>
    import('./sections/rich-text-section.component').then((m) => m.RichTextSectionComponent),
  [SectionType.VACANCY_LIST]: () =>
    import('./sections/vacancy-list-section.component').then(
      (m) => m.VacancyListSectionComponent,
    ),
  [SectionType.BLOG_LIST]: () =>
    import('./sections/blog-list-section.component').then((m) => m.BlogListSectionComponent),
  [SectionType.LOGO_CLOUD]: () =>
    import('./sections/logo-cloud-section.component').then((m) => m.LogoCloudSectionComponent),
  [SectionType.FAQ]: () =>
    import('./sections/faq-section.component').then((m) => m.FaqSectionComponent),
};

interface LoadedSection {
  section: PageSection;
  component: Type<SectionComponent> | null;
}

@Component({
  selector: 'lib-section-renderer',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of loadedSections; track item.section.id) {
      @if (item.component) {
        <ng-container
          [ngComponentOutlet]="item.component"
          [ngComponentOutletInputs]="{ config: item.section.config }"
        />
      }
    }
  `,
})
export class SectionRendererComponent implements OnInit {
  sections = input.required<PageSection[]>();

  loadedSections: LoadedSection[] = [];

  private platformId = inject(PLATFORM_ID);

  async ngOnInit() {
    const sorted = [...this.sections()].sort((a, b) => a.order - b.order);

    this.loadedSections = await Promise.all(
      sorted.map(async (section) => {
        const loader = SECTION_LOADERS[section.type];
        if (!loader) {
          console.warn(`No component registered for section type: ${section.type}`);
          return { section, component: null };
        }
        try {
          const component = await loader();
          return { section, component };
        } catch (err) {
          if (isPlatformBrowser(this.platformId)) {
            console.error(`Failed to load section component for type ${section.type}:`, err);
          }
          return { section, component: null };
        }
      }),
    );
  }
}
