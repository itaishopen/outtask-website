import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PublicApiService } from '../../../core/services/public-api.service';
import type { BlogListSectionConfig, BlogPostSummary } from '../../models/api.models';

@Component({
  selector: 'app-blog-list-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-list-section.component.html',
  styleUrl: './blog-list-section.component.scss',
})
export class BlogListSectionComponent implements OnInit {
  readonly config = input.required<BlogListSectionConfig>();

  private readonly api = inject(PublicApiService);

  readonly posts = signal<BlogPostSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    const cfg = this.config();
    this.api.getBlogPosts(1, cfg.limit ?? 3).subscribe({
      next: (res) => {
        this.posts.set(res.data.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
