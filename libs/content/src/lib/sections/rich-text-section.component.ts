import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { RichTextConfig } from '@outtask/shared-types';

@Component({
  selector: 'lib-rich-text-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <section class="rich-text-section section">
      <div class="container">
        <div
          class="prose"
          [class.rich-text-section__narrow]="config().maxWidth === 'sm'"
          [class.rich-text-section__wide]="config().maxWidth === 'lg'"
          [innerHTML]="safeHtml"
        ></div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .rich-text-section { padding-block: 5rem; }

    .prose { max-width: 72ch; }
    .rich-text-section__narrow { max-width: 52ch; }
    .rich-text-section__wide { max-width: 90ch; }
  `],
})
export class RichTextSectionComponent {
  readonly config = input.required<RichTextConfig>();
  private readonly sanitizer = inject(DomSanitizer);

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.config().content);
  }
}
