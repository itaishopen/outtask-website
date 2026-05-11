import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import type { FaqSectionConfig } from '../../models/api.models';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss',
})
export class FaqSectionComponent {
  readonly config = input.required<FaqSectionConfig>();
  readonly openIndex = signal<number | null>(null);

  toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? null : index));
  }

  isOpen(index: number): boolean {
    return this.openIndex() === index;
  }
}
