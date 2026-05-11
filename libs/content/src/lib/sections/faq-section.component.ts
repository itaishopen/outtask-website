import { Component, input, ChangeDetectionStrategy, signal } from '@angular/core';
import { FaqConfig } from '@outtask/shared-types';

@Component({
  selector: 'lib-faq-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="faq-section">
      <div class="container">
        @if (config().heading) {
          <h2 class="faq-section__heading">{{ config().heading }}</h2>
        }
        <div class="faq-section__list">
          @for (item of config().items; track $index) {
            <div class="faq-item" [class.faq-item--open]="openIndex() === $index">
              <button class="faq-item__question" (click)="toggle($index)" [attr.aria-expanded]="openIndex() === $index">
                <span>{{ item.question }}</span>
                <span class="faq-item__icon" aria-hidden="true">{{ openIndex() === $index ? '−' : '+' }}</span>
              </button>
              @if (openIndex() === $index) {
                <div class="faq-item__answer">{{ item.answer }}</div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .faq-section { padding: 5rem 0; }
    .container { max-width: 720px; margin: 0 auto; padding: 0 1.5rem; }
    .faq-section__heading { text-align: center; margin-bottom: 2.5rem; font-size: 2rem; }
    .faq-section__list { display: flex; flex-direction: column; gap: 0.5rem; }
    .faq-item { border: 1px solid var(--color-border); border-radius: 10px; overflow: hidden; }
    .faq-item__question {
      width: 100%; display: flex; justify-content: space-between; align-items: center;
      padding: 1.25rem 1.5rem; background: none; border: none; cursor: pointer;
      font-size: 1rem; font-weight: 600; text-align: left; gap: 1rem;
      &:hover { background: var(--color-bg-alt); }
    }
    .faq-item__icon { font-size: 1.25rem; flex-shrink: 0; color: var(--color-primary); }
    .faq-item__answer { padding: 0 1.5rem 1.25rem; color: var(--color-text-muted); line-height: 1.7; }
  `],
})
export class FaqSectionComponent {
  config = input.required<FaqConfig>();
  openIndex = signal<number | null>(null);

  toggle(index: number) {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
