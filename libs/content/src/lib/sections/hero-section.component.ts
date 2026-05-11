import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import type { HeroConfig } from '@outtask/shared-types';

@Component({
  selector: 'lib-hero-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgClass],
  template: `
    <section class="hero">
      <div class="hero__bg-decoration" aria-hidden="true">
        <div class="hero__blob hero__blob--1"></div>
        <div class="hero__blob hero__blob--2"></div>
      </div>
      <div class="container hero__content">
        <h1 class="hero__headline">{{ config().headline }}</h1>
        @if (config().subheadline) {
          <p class="hero__subheadline">{{ config().subheadline }}</p>
        }
        <div class="hero__ctas">
          @if (config().primaryCta) {
            <a [routerLink]="config().primaryCta!.href" class="btn btn-primary btn--lg">
              {{ config().primaryCta!.label }}
            </a>
          }
          @if (config().secondaryCta) {
            <a [routerLink]="config().secondaryCta!.href" class="btn btn-outline btn-outline--white btn--lg">
              {{ config().secondaryCta!.label }}
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .hero {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #0f172a 0%, #1a2d52 40%, #2563eb 100%);
      color: #fff;
      padding-block: 7rem 6rem;
      min-height: 560px;
      display: flex;
      align-items: center;
    }

    .hero__bg-decoration {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }

    .hero__blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
    }

    .hero__blob--1 {
      width: 600px;
      height: 600px;
      background: #3b82f6;
      top: -200px;
      right: -100px;
    }

    .hero__blob--2 {
      width: 400px;
      height: 400px;
      background: #f97316;
      bottom: -150px;
      left: -80px;
    }

    .hero__content {
      position: relative;
      z-index: 1;
      max-width: 820px;
    }

    .hero__headline {
      font-family: var(--font-heading, 'Sora', sans-serif);
      font-size: clamp(2.25rem, 6vw, 4rem);
      font-weight: 800;
      color: #fff;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      letter-spacing: -0.02em;
      animation: fade-up 0.6s ease both;
    }

    .hero__subheadline {
      font-size: clamp(1rem, 2.5vw, 1.25rem);
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.7;
      margin-bottom: 2.5rem;
      max-width: 620px;
      animation: fade-up 0.6s 0.1s ease both;
    }

    .hero__ctas {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      animation: fade-up 0.6s 0.2s ease both;
    }

    @keyframes fade-up {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 480px) {
      .hero__ctas {
        flex-direction: column;
      }
      .hero__ctas .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `],
})
export class HeroSectionComponent {
  readonly config = input.required<HeroConfig>();
}
