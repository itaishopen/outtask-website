import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../shared/services/admin-api.service';
import { MediaAsset } from '@outtask/shared-types';

@Component({
  selector: 'app-media-library',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="media-library">
      <div class="page-header">
        <div>
          <h1 class="page-title">Media Library</h1>
          <p class="page-subtitle">Manage images and files.</p>
        </div>
        <div class="header-actions">
          <input
            #fileInput
            type="file"
            accept="image/*,video/*,application/pdf"
            multiple
            class="file-input-hidden"
            (change)="onFileSelected($event)"
          />
          <button class="btn btn-primary" (click)="fileInput.click()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
            </svg>
            Upload
          </button>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <button class="filter-btn" [class.active]="typeFilter() === ''" (click)="typeFilter.set('')">All</button>
        <button class="filter-btn" [class.active]="typeFilter() === 'image'" (click)="typeFilter.set('image')">Images</button>
        <button class="filter-btn" [class.active]="typeFilter() === 'video'" (click)="typeFilter.set('video')">Videos</button>
        <button class="filter-btn" [class.active]="typeFilter() === 'application'" (click)="typeFilter.set('application')">Documents</button>
      </div>

      <!-- Drop zone -->
      <div
        class="drop-zone"
        [class.drag-over]="isDragOver()"
        (dragover)="onDragOver($event)"
        (dragleave)="isDragOver.set(false)"
        (drop)="onDrop($event)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
        </svg>
        <p>Drop files here or <button type="button" class="link-btn" (click)="fileInput.click()">browse</button></p>
      </div>

      @if (uploading()) {
        <div class="upload-progress">
          <div class="progress-bar"><div class="progress-fill"></div></div>
          <p>Uploading {{ uploadQueue().length }} file(s)&hellip;</p>
        </div>
      }

      @if (loading()) {
        <div class="loading-state">Loading media&hellip;</div>
      } @else if (filtered().length === 0) {
        <div class="empty-state">
          <p>No media files found.</p>
        </div>
      } @else {
        <div class="media-grid">
          @for (asset of filtered(); track asset.id) {
            <div class="media-item" [class.selected]="selectedId() === asset.id" (click)="select(asset)">
              @if (isImage(asset)) {
                <div class="media-thumb">
                  <img [src]="asset.url" [alt]="asset.originalName" loading="lazy" />
                </div>
              } @else {
                <div class="media-thumb media-thumb--file">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
              }
              <div class="media-info">
                <span class="media-name" [title]="asset.originalName">{{ asset.originalName }}</span>
                <span class="media-size">{{ formatSize(asset.size) }}</span>
              </div>
              <div class="media-actions" (click)="$event.stopPropagation()">
                <button class="icon-action" (click)="copyUrl(asset)" title="Copy URL">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
                <button class="icon-action icon-action--danger" (click)="deleteAsset(asset)" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      }

      @if (toast()) {
        <div class="toast">{{ toast() }}</div>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      gap: 1rem;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .file-input-hidden {
      display: none;
    }

    .filter-bar {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .filter-btn {
      padding: 0.375rem 0.875rem;
      border-radius: 99px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.1s;

      &:hover, &.active {
        background: #0f172a;
        color: white;
        border-color: #0f172a;
      }
    }

    .drop-zone {
      border: 2px dashed #e2e8f0;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      margin-bottom: 1.5rem;
      transition: all 0.15s;
      background: #fafafa;

      &.drag-over {
        border-color: #3b82f6;
        background: #eff6ff;
      }

      svg {
        width: 36px;
        height: 36px;
        color: #94a3b8;
        margin: 0 auto 0.75rem;
        display: block;
      }

      p {
        color: #64748b;
        font-size: 0.875rem;
        margin: 0;
      }
    }

    .link-btn {
      background: none;
      border: none;
      color: #3b82f6;
      cursor: pointer;
      font-size: inherit;
      padding: 0;
      text-decoration: underline;
    }

    .upload-progress {
      margin-bottom: 1rem;
      text-align: center;

      p {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0.5rem 0 0;
      }
    }

    .progress-bar {
      height: 4px;
      background: #e2e8f0;
      border-radius: 99px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #3b82f6;
      border-radius: 99px;
      animation: progress-indeterminate 1.5s infinite;
    }

    @keyframes progress-indeterminate {
      0% { transform: translateX(-100%); width: 60%; }
      100% { transform: translateX(200%); width: 60%; }
    }

    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }

    .media-item {
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: border-color 0.1s;
      background: white;
      position: relative;

      &:hover {
        border-color: #94a3b8;
      }

      &.selected {
        border-color: #3b82f6;
      }

      &:hover .media-actions {
        opacity: 1;
      }
    }

    .media-thumb {
      aspect-ratio: 16/9;
      overflow: hidden;
      background: #f1f5f9;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    .media-thumb--file {
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 36px;
        height: 36px;
        color: #94a3b8;
      }
    }

    .media-info {
      padding: 0.5rem 0.625rem;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .media-name {
      font-size: 0.75rem;
      font-weight: 500;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .media-size {
      font-size: 0.7rem;
      color: #94a3b8;
    }

    .media-actions {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      display: flex;
      gap: 0.25rem;
      opacity: 0;
      transition: opacity 0.1s;
    }

    .icon-action {
      width: 28px;
      height: 28px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);

      svg {
        width: 14px;
        height: 14px;
      }

      &:hover {
        background: #f8fafc;
      }

      &.icon-action--danger:hover {
        background: #fee2e2;
        border-color: #fca5a5;
        color: #dc2626;
      }
    }

    .loading-state, .empty-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }

    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #0f172a;
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.875rem;
      z-index: 1000;
      animation: toast-in 0.2s ease;
    }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class MediaLibraryComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly assets = signal<MediaAsset[]>([]);
  readonly loading = signal(true);
  readonly uploading = signal(false);
  readonly uploadQueue = signal<File[]>([]);
  readonly isDragOver = signal(false);
  readonly typeFilter = signal('');
  readonly selectedId = signal<string | null>(null);
  readonly toast = signal<string | null>(null);

  readonly filtered = computed(() => {
    const f = this.typeFilter();
    if (!f) return this.assets();
    return this.assets().filter((a) => a.mimeType.startsWith(f));
  });

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.loading.set(true);
    this.api.listMedia().subscribe({
      next: (res) => {
        this.assets.set(res.data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.uploadFiles(Array.from(input.files));
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length) this.uploadFiles(files);
  }

  uploadFiles(files: File[]): void {
    this.uploadQueue.set(files);
    this.uploading.set(true);

    const uploads = files.map(
      (file) =>
        new Promise<void>((resolve) => {
          this.api.uploadFile(file).subscribe({
            next: (res) => {
              this.assets.update((prev) => [res.data, ...prev]);
              resolve();
            },
            error: () => resolve(),
          });
        }),
    );

    Promise.all(uploads).then(() => {
      this.uploading.set(false);
      this.uploadQueue.set([]);
      this.showToast(`Uploaded ${files.length} file(s).`);
      this.cdr.markForCheck();
    });
  }

  select(asset: MediaAsset): void {
    this.selectedId.update((id) => (id === asset.id ? null : asset.id));
  }

  copyUrl(asset: MediaAsset): void {
    navigator.clipboard.writeText(asset.url).then(() => {
      this.showToast('URL copied to clipboard!');
    });
  }

  deleteAsset(asset: MediaAsset): void {
    if (!confirm(`Delete "${asset.originalName}"?`)) return;
    this.api.deleteMedia(asset.id).subscribe({
      next: () => {
        this.assets.update((prev) => prev.filter((a) => a.id !== asset.id));
        if (this.selectedId() === asset.id) this.selectedId.set(null);
        this.cdr.markForCheck();
      },
      error: () => alert('Failed to delete file.'),
    });
  }

  isImage(asset: MediaAsset): boolean {
    return asset.mimeType.startsWith('image/');
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private showToast(message: string): void {
    this.toast.set(message);
    this.cdr.markForCheck();
    setTimeout(() => {
      this.toast.set(null);
      this.cdr.markForCheck();
    }, 3000);
  }
}
