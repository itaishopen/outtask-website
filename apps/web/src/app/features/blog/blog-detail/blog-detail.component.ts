import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicApiService } from '@outtask/data-access';
import { SeoService } from '../../../core/services/seo.service';
import type { BlogPost } from '@outtask/shared-types';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  readonly slug = input.required<string>();

  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly post = signal<BlogPost | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.api.getBlogPost(this.slug()).subscribe({
      next: (post) => {
        this.post.set(post);
        this.seo.setPage({
          title: post.seoTitle ?? post.title,
          description: post.seoDesc ?? post.excerpt ?? undefined,
          image: post.featuredImage ?? undefined,
          type: 'article',
          publishedAt: post.publishedAt ?? undefined,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  get safeContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.post()?.content ?? '');
  }
}
