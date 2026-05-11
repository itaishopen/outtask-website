import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgClass } from '@angular/common';
import type { RichTextSectionConfig } from '../../models/api.models';

@Component({
  selector: 'app-rich-text-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  templateUrl: './rich-text-section.component.html',
  styleUrl: './rich-text-section.component.scss',
})
export class RichTextSectionComponent {
  readonly config = input.required<RichTextSectionConfig>();

  private readonly sanitizer = inject(DomSanitizer);

  get safeHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.config().html);
  }
}
