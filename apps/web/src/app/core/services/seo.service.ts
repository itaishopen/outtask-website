import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  author?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  setPage(config: SeoConfig): void {
    const fullTitle = config.title.includes('Outtask')
      ? config.title
      : `${config.title} | Outtask`;

    this.title.setTitle(fullTitle);

    // Basic meta
    if (config.description) {
      this.meta.updateTag({ name: 'description', content: config.description });
    }

    // OG tags
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:type', content: config.type ?? 'website' });

    if (config.description) {
      this.meta.updateTag({ property: 'og:description', content: config.description });
    }

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }

    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    // Twitter card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });

    if (config.description) {
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }

    if (config.image) {
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }

    // Article-specific
    if (config.type === 'article') {
      if (config.publishedAt) {
        this.meta.updateTag({ property: 'article:published_time', content: config.publishedAt });
      }
      if (config.author) {
        this.meta.updateTag({ property: 'article:author', content: config.author });
      }
    }
  }

  setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
