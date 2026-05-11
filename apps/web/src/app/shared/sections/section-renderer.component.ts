import {
  ChangeDetectionStrategy,
  Component,
  input,
  Type,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PageSection } from '@outtask/shared-types';
import { SectionType } from '@outtask/shared-types';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { TextImageSectionComponent } from './text-image-section/text-image-section.component';
import { CardsSectionComponent } from './cards-section/cards-section.component';
import { TestimonialsSectionComponent } from './testimonials-section/testimonials-section.component';
import { CtaSectionComponent } from './cta-section/cta-section.component';
import { RichTextSectionComponent } from './rich-text-section/rich-text-section.component';
import { VacancyListSectionComponent } from './vacancy-list-section/vacancy-list-section.component';
import { BlogListSectionComponent } from './blog-list-section/blog-list-section.component';
import { LogoCloudSectionComponent } from './logo-cloud-section/logo-cloud-section.component';
import { FaqSectionComponent } from './faq-section/faq-section.component';

// Maps backend SectionType enum values (UPPER_CASE) to components
const SECTION_COMPONENT_MAP: Partial<Record<SectionType, Type<unknown>>> = {
  [SectionType.HERO]: HeroSectionComponent,
  [SectionType.TEXT_IMAGE]: TextImageSectionComponent,
  [SectionType.CARDS]: CardsSectionComponent,
  [SectionType.TESTIMONIALS]: TestimonialsSectionComponent,
  [SectionType.CTA]: CtaSectionComponent,
  [SectionType.RICH_TEXT]: RichTextSectionComponent,
  [SectionType.VACANCY_LIST]: VacancyListSectionComponent,
  [SectionType.BLOG_LIST]: BlogListSectionComponent,
  [SectionType.LOGO_CLOUD]: LogoCloudSectionComponent,
  [SectionType.FAQ]: FaqSectionComponent,
};

@Component({
  selector: 'app-section-renderer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet],
  template: `
    @for (section of sortedSections(); track section.id) {
      @if (getComponent(section.type); as component) {
        <ng-container
          [ngComponentOutlet]="component"
          [ngComponentOutletInputs]="{ config: section.config }"
        />
      }
    }
  `,
})
export class SectionRendererComponent {
  readonly sections = input.required<PageSection[]>();

  sortedSections() {
    return [...this.sections()].sort((a, b) => a.order - b.order);
  }

  getComponent(type: SectionType): Type<unknown> | null {
    return SECTION_COMPONENT_MAP[type] ?? null;
  }
}
