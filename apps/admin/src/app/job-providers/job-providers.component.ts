import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminApiService } from '../shared/services/admin-api.service';
import { JobProviderConfig } from '@outtask/shared-types';

type ProviderType = 'manual' | 'recruitee' | 'greenhouse' | 'teamtailor';

@Component({
  selector: 'app-job-providers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  template: `
    <div class="job-providers">
      <div class="page-header">
        <div>
          <h1 class="page-title">Job Providers</h1>
          <p class="page-subtitle">Configure external job board integrations.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="syncAll()" [disabled]="syncing()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
            {{ syncing() ? 'Syncing…' : 'Sync All Enabled' }}
          </button>
          <button class="btn btn-primary" (click)="openAddModal()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Provider
          </button>
        </div>
      </div>

      @if (syncResults().length > 0) {
        <div class="sync-results">
          @for (r of syncResults(); track r.providerId) {
            <div class="sync-result">
              <strong>{{ r.providerName }}:</strong>
              {{ r.created }} created, {{ r.updated }} updated
              @if (r.errors.length > 0) {
                <span class="sync-error">&bull; {{ r.errors.length }} error(s)</span>
              }
            </div>
          }
        </div>
      }

      <div class="card">
        @if (loading()) {
          <div class="loading-state">Loading providers&hellip;</div>
        } @else if (providers().length === 0) {
          <div class="empty-state">
            <p>No providers configured.</p>
            <button class="btn btn-primary btn-sm" (click)="openAddModal()">Add your first provider</button>
          </div>
        } @else {
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Enabled</th>
                <th>Last Sync</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (provider of providers(); track provider.id) {
                <tr>
                  <td class="font-medium">{{ provider.name }}</td>
                  <td>
                    <span class="badge badge--type">{{ provider.type }}</span>
                  </td>
                  <td>
                    <label class="toggle">
                      <input
                        type="checkbox"
                        class="toggle-checkbox"
                        [checked]="provider.enabled"
                        (change)="toggleEnabled(provider)"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                  </td>
                  <td class="text-muted">
                    {{ provider.lastSyncAt ? (provider.lastSyncAt | date:'dd MMM, HH:mm') : 'Never' }}
                  </td>
                  <td class="col-actions">
                    <div class="action-btns">
                      <button
                        class="btn btn-ghost btn-sm"
                        (click)="syncProvider(provider)"
                        [disabled]="syncingId() === provider.id"
                      >
                        {{ syncingId() === provider.id ? 'Syncing…' : 'Sync' }}
                      </button>
                      <button class="btn btn-ghost btn-sm" (click)="openEditModal(provider)">Edit</button>
                      <button class="btn btn-danger btn-sm" (click)="deleteProvider(provider)">Delete</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>

    <!-- Modal -->
    @if (modalOpen()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">{{ editingId() ? 'Edit Provider' : 'Add Provider' }}</h2>
            <button class="modal-close" (click)="closeModal()">×</button>
          </div>
          <div class="modal-body">
            <form [formGroup]="form">
              <div class="form-group">
                <label class="form-label">Name <span class="required">*</span></label>
                <input type="text" formControlName="name" class="form-input" placeholder="My Provider" />
                @if (form.get('name')?.invalid && form.get('name')?.touched) {
                  <span class="form-error">Name is required</span>
                }
              </div>
              <div class="form-group">
                <label class="form-label">Type <span class="required">*</span></label>
                <select formControlName="type" class="form-input">
                  <option value="">— Select —</option>
                  <option value="manual">Manual</option>
                  <option value="recruitee">Recruitee</option>
                  <option value="greenhouse">Greenhouse</option>
                  <option value="teamtailor">Teamtailor</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Config (JSON)</label>
                <textarea
                  formControlName="config"
                  class="form-input form-textarea form-textarea--mono"
                  rows="5"
                  placeholder='{"apiKey": "..."}'
                ></textarea>
                @if (configError()) {
                  <span class="form-error">{{ configError() }}</span>
                }
              </div>
              <div class="form-group">
                <label class="toggle-label">
                  <input type="checkbox" formControlName="enabled" class="toggle-input" />
                  <span>Enabled</span>
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" (click)="saveProvider()" [disabled]="saving()">
              {{ saving() ? 'Saving…' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .sync-results {
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 8px;
      padding: 0.875rem 1rem;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .sync-result {
      font-size: 0.875rem;
      color: #166534;
    }

    .sync-error {
      color: #dc2626;
      margin-left: 0.5rem;
    }

    .col-actions {
      width: 210px;
    }

    .action-btns {
      display: flex;
      gap: 0.25rem;
    }

    .badge--type {
      background: #f1f5f9;
      color: #475569;
      text-transform: capitalize;
    }

    /* Toggle switch */
    .toggle {
      position: relative;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }

    .toggle-checkbox {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }

    .toggle-slider {
      width: 36px;
      height: 20px;
      background: #e2e8f0;
      border-radius: 99px;
      transition: background 0.2s;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 50%;
        transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
    }

    .toggle-checkbox:checked + .toggle-slider {
      background: #10b981;

      &::after {
        transform: translateX(16px);
      }
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .toggle-input {
      accent-color: #10b981;
    }

    .form-textarea--mono {
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 0.8rem;
    }

    .loading-state, .empty-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }
  `],
})
export class JobProvidersComponent implements OnInit {
  private readonly api = inject(AdminApiService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly providers = signal<JobProviderConfig[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly syncing = signal(false);
  readonly syncingId = signal<string | null>(null);
  readonly modalOpen = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly syncResults = signal<{ providerId: string; providerName: string; created: number; updated: number; errors: string[] }[]>([]);
  readonly configError = signal<string | null>(null);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      config: ['{}'],
      enabled: [true],
    });
    this.loadProviders();
  }

  loadProviders(): void {
    this.loading.set(true);
    this.api.listProviders().subscribe({
      next: (res) => {
        this.providers.set(res.data);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', type: '', config: '{}', enabled: true });
    this.configError.set(null);
    this.modalOpen.set(true);
    this.cdr.markForCheck();
  }

  openEditModal(provider: JobProviderConfig): void {
    this.editingId.set(provider.id);
    this.form.patchValue({
      name: provider.name,
      type: provider.type,
      config: JSON.stringify(provider.config, null, 2),
      enabled: provider.enabled,
    });
    this.configError.set(null);
    this.modalOpen.set(true);
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingId.set(null);
  }

  saveProvider(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const rawConfig = this.form.get('config')?.value ?? '{}';
    let parsedConfig: Record<string, unknown>;
    try {
      parsedConfig = JSON.parse(rawConfig);
      this.configError.set(null);
    } catch {
      this.configError.set('Invalid JSON in config field.');
      this.cdr.markForCheck();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const dto = {
      name: value['name'],
      type: value['type'],
      config: parsedConfig,
      enabled: value['enabled'],
    };

    const editId = this.editingId();
    const request$ = editId
      ? this.api.updateProvider(editId, dto)
      : this.api.createProvider(dto);

    request$.subscribe({
      next: (res) => {
        if (editId) {
          this.providers.update((prev) =>
            prev.map((p) => (p.id === editId ? res.data : p)),
          );
        } else {
          this.providers.update((prev) => [...prev, res.data]);
        }
        this.saving.set(false);
        this.closeModal();
        this.cdr.markForCheck();
      },
      error: () => {
        this.saving.set(false);
        alert('Failed to save provider.');
        this.cdr.markForCheck();
      },
    });
  }

  deleteProvider(provider: JobProviderConfig): void {
    if (!confirm(`Delete "${provider.name}"?`)) return;
    this.api.deleteProvider(provider.id).subscribe({
      next: () => {
        this.providers.update((prev) => prev.filter((p) => p.id !== provider.id));
        this.cdr.markForCheck();
      },
      error: () => alert('Failed to delete provider.'),
    });
  }

  toggleEnabled(provider: JobProviderConfig): void {
    this.api.updateProvider(provider.id, { enabled: !provider.enabled }).subscribe({
      next: (res) => {
        this.providers.update((prev) =>
          prev.map((p) => (p.id === provider.id ? res.data : p)),
        );
        this.cdr.markForCheck();
      },
      error: () => {
        alert('Failed to update provider.');
        this.cdr.markForCheck();
      },
    });
  }

  syncProvider(provider: JobProviderConfig): void {
    this.syncingId.set(provider.id);
    this.api.syncProvider(provider.id).subscribe({
      next: (res) => {
        this.syncResults.set([res.data]);
        this.syncingId.set(null);
        this.providers.update((prev) =>
          prev.map((p) =>
            p.id === provider.id ? { ...p, lastSyncAt: res.data.syncedAt } : p,
          ),
        );
        this.cdr.markForCheck();
      },
      error: () => {
        this.syncingId.set(null);
        alert('Sync failed.');
        this.cdr.markForCheck();
      },
    });
  }

  syncAll(): void {
    this.syncing.set(true);
    this.api.syncVacancies().subscribe({
      next: (res) => {
        this.syncResults.set(res.data);
        this.syncing.set(false);
        this.loadProviders();
        this.cdr.markForCheck();
      },
      error: () => {
        this.syncing.set(false);
        alert('Sync all failed.');
        this.cdr.markForCheck();
      },
    });
  }
}
