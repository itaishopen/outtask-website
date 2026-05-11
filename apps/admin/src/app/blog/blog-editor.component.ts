import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminApiService } from '../shared/services/admin-api.service';
import { BlogPost, ContentStatus } from '@outtask/shared-types';

@Component({
  selector: 'app-blog-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe],
  template: `
    <div class="blog-editor">
      <div class="page-header">
        <div class="breadcrumb">
          <a routerLink="/blog" class="breadcrumb-link">Blog</a>
          <span class="breadcrumb-sep">/</span>
          <span>{{ isNew() ? 'New Post' : form.get('title')?.value || 'Edit Post' }}</span>
        </div>
        <div class="header-actions">
          @if (!isNew()) {
            <a [href]="'/blog/' + currentPost()?.slug" target="_blank" class="btn btn-ghost btn-sm">
              Preview ↗
            </a>
          }
          <a routerLink="/blog" class="btn btn-ghost">Cancel</a>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
            {{ saving() ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-state">Loading&hellip;</div>
      } @else {
        <form [formGroup]="form" class="editor-layout">
          <!-- Main -->
          <div class="editor-main">
            <div class="card">
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Title <span class="required">*</span></label>
                  <input type="text" formControlName="title" class="form-input form-input--lg" placeholder="Post title" (input)="onTitleInput()" />
                  @if (form.get('title')?.invalid && form.get('title')?.touched) {
                    <span class="form-error">Title is required</span>
                  }
                </div>

                <div class="form-group">
                  <label class="form-label">Slug</label>
                  <div class="input-prefix-group">
                    <span class="input-prefix">/blog/</span>
                    <input type="text" formControlName="slug" class="form-input" placeholder="my-post-slug" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Excerpt</label>
                  <textarea formControlName="excerpt" class="form-input form-textarea" rows="2" placeholder="Short description shown in listing pages"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Content</label>
                  <textarea formControlName="content" class="form-input form-textarea form-textarea--lg" rows="16" placeholder="Rich text editor — integrate TipTap or Quill in production"></textarea>
                </div>
              </div>
            </div>

            <!-- SEO -->
            <div class="card">
              <div class="card-header"><h2 class="card-title">SEO</h2></div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">SEO Title</label>
                  <input type="text" formControlName="seoTitle" class="form-input" placeholder="Overrides post title in search results" />
                </div>
                <div class="form-group">
                  <label class="form-label">SEO Description</label>
                  <textarea formControlName="seoDesc" class="form-input form-textarea" rows="2" placeholder="Meta description"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="editor-sidebar">
            <!-- Status -->
            <div class="card">
              <div class="card-header"><h2 class="card-title">Publish</h2></div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Status</label>
                  <select formControlName="status" class="form-input">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>

                @if (!isNew() && currentPost()) {
                  <div class="publish-actions">
                    @if (currentPost()!.status === 'DRAFT') {
                      <button type="button" class="btn btn-success btn-full" (click)="publish()" [disabled]="saving()">
                        Publish now
                      </button>
                    } @else {
                      <button type="button" class="btn btn-warning btn-full" (click)="unpublish()" [disabled]="saving()">
                        Unpublish
                      </button>
                      @if (currentPost()!.publishedAt) {
                        <p class="publish-date">Published {{ currentPost()!.publishedAt | date:'dd MMM yyyy' }}</p>
                      }
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Featured image -->
            <div class="card">
              <div class="card-header"><h2 class="card-title">Featured Image</h2></div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Image URL</label>
                  <input type="text" formControlName="featuredImage" class="form-input" placeholder="https://…" />
                </div>
                @if (form.get('featuredImage')?.value) {
                  <div class="image-preview">
                    <img [src]="form.get('featuredImage')?.value" alt="Featured image preview" />
                  </div>
                }
              </div>
            </div>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .editor-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 1rem;
      align-items: start;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .editor-main {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .editor-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: sticky;
      top: 80px;
    }

    .input-prefix-group {
      display: flex;
    }

    .input-prefix {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-right: none;
      padding: 0 0.75rem;
      height: 40px;
      display: flex;
      align-items: center;
      color: #64748b;
      border-radius: 6px 0 0 6px;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .input-prefix + .form-input {
      border-radius: 0 6px 6px 0;
    }

    .form-textarea--lg {
      min-height: 320px;
      resize: vertical;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.875rem;
    }

    .form-input--lg {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .publish-actions {
      margin-top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .btn-full {
      width: 100%;
      justify-content: center;
    }

    .btn-success {
      background: #10b981;
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background: #059669;
      }
    }

    .btn-warning {
      background: #f59e0b;
      color: white;
      border: none;

      &:hover:not(:disabled) {
        background: #d97706;
      }
    }

    .publish-date {
      font-size: 0.75rem;
      color: #94a3b8;
      text-align: center;
      margin: 0;
    }

    .image-preview {
      margin-top: 0.75rem;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #e2e8f0;

      img {
        width: 100%;
        height: 140px;
        object-fit: cover;
        display: block;
      }
    }

    .loading-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }
  `],
})
export class BlogEditorComponent implements OnInit {
  @Input() id?: string;

  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly currentPost = signal<BlogPost | null>(null);

  readonly isNew = computed(() => !this.id || this.id === 'new');

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      excerpt: [''],
      content: [''],
      featuredImage: [''],
      seoTitle: [''],
      seoDesc: [''],
      status: [ContentStatus.DRAFT],
    });

    if (!this.isNew()) {
      this.loadPost();
    }
  }

  loadPost(): void {
    this.loading.set(true);
    this.api.getPost(this.id!).subscribe({
      next: (res) => {
        const p = res.data;
        this.currentPost.set(p);
        this.form.patchValue({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt ?? '',
          content: p.content,
          featuredImage: p.featuredImage ?? '',
          seoTitle: p.seoTitle ?? '',
          seoDesc: p.seoDesc ?? '',
          status: p.status,
        });
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  onTitleInput(): void {
    if (!this.isNew()) return;
    const title: string = this.form.get('title')?.value ?? '';
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    this.form.get('slug')?.setValue(slug, { emitEvent: false });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);
    const value = this.form.getRawValue();
    const dto = {
      title: value['title'],
      slug: value['slug'],
      excerpt: value['excerpt'] || null,
      content: value['content'],
      featuredImage: value['featuredImage'] || null,
      seoTitle: value['seoTitle'] || null,
      seoDesc: value['seoDesc'] || null,
      status: value['status'],
    };

    const request$ = this.isNew()
      ? this.api.createPost(dto)
      : this.api.updatePost(this.id!, dto);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/blog']);
      },
      error: () => {
        this.saving.set(false);
        alert('Failed to save post.');
        this.cdr.markForCheck();
      },
    });
  }

  publish(): void {
    if (!this.id) return;
    this.saving.set(true);
    this.api.publishPost(this.id).subscribe({
      next: (res) => {
        this.currentPost.set(res.data);
        this.form.get('status')?.setValue(ContentStatus.PUBLISHED);
        this.saving.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.saving.set(false);
        alert('Failed to publish post.');
        this.cdr.markForCheck();
      },
    });
  }

  unpublish(): void {
    if (!this.id) return;
    this.saving.set(true);
    this.api.unpublishPost(this.id).subscribe({
      next: (res) => {
        this.currentPost.set(res.data);
        this.form.get('status')?.setValue(ContentStatus.DRAFT);
        this.saving.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.saving.set(false);
        alert('Failed to unpublish post.');
        this.cdr.markForCheck();
      },
    });
  }
}
