import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { PublicApiService } from '@outtask/data-access';
import { BlogCardComponent } from '@outtask/ui';
import { SeoService } from '../../../core/services/seo.service';
import type { BlogPostSummary } from '@outtask/shared-types';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlogCardComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly posts = signal<BlogPostSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly limit = 12;

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Blog — IT Insights & Tech Hiring',
      description: 'Read the latest insights on IT staffing, nearshoring, and tech hiring from the Outtask team.',
    });
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.api.getBlogPosts(this.currentPage(), this.limit).subscribe({
      next: (res) => {
        this.posts.set(res.data);
        this.totalPages.set(Math.ceil(res.total / this.limit));
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}
