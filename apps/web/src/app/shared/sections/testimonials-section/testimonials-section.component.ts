import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { TestimonialsSectionConfig } from '../../models/api.models';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.scss',
})
export class TestimonialsSectionComponent {
  readonly config = input.required<TestimonialsSectionConfig>();

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
