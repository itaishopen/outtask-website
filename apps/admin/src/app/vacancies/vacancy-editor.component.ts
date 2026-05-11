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
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminApiService } from '../shared/services/admin-api.service';
import { Vacancy, ContentStatus } from '@outtask/shared-types';

@Component({
  selector: 'app-vacancy-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="vacancy-editor">
      <div class="page-header">
        <div class="breadcrumb">
          <a routerLink="/vacancies" class="breadcrumb-link">Vacancies</a>
          <span class="breadcrumb-sep">/</span>
          <span>{{ isNew() ? 'New Vacancy' : form.get('title')?.value || 'Edit Vacancy' }}</span>
        </div>
        <div class="header-actions">
          <a routerLink="/vacancies" class="btn btn-ghost">Cancel</a>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
            {{ saving() ? 'Saving…' : 'Save Vacancy' }}
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
              <div class="card-header"><h2 class="card-title">Job Details</h2></div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Job Title <span class="required">*</span></label>
                  <input type="text" formControlName="title" class="form-input" placeholder="e.g. Senior Software Engineer" />
                  @if (form.get('title')?.invalid && form.get('title')?.touched) {
                    <span class="form-error">Title is required</span>
                  }
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" formControlName="location" class="form-input" placeholder="e.g. Amsterdam, Remote" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Department</label>
                    <input type="text" formControlName="department" class="form-input" placeholder="e.g. Engineering" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Employment Type</label>
                    <select formControlName="employmentType" class="form-input">
                      <option value="">— Select —</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Seniority</label>
                    <select formControlName="seniority" class="form-input">
                      <option value="">— Select —</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                      <option value="Principal">Principal</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Apply URL</label>
                  <input type="url" formControlName="applyUrl" class="form-input" placeholder="https://…" />
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header"><h2 class="card-title">Description</h2></div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Job Description <span class="required">*</span></label>
                  <textarea formControlName="description" class="form-input form-textarea form-textarea--lg" rows="10" placeholder="Rich text editor — integrate TipTap or Quill in production"></textarea>
                  @if (form.get('description')?.invalid && form.get('description')?.touched) {
                    <span class="form-error">Description is required</span>
                  }
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header"><h2 class="card-title">Requirements & Benefits</h2></div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Requirements</label>
                  <textarea formControlName="requirements" class="form-input form-textarea" rows="6" placeholder="Rich text editor — integrate TipTap or Quill in production"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Benefits</label>
                  <textarea formControlName="benefits" class="form-input form-textarea" rows="6" placeholder="Rich text editor — integrate TipTap or Quill in production"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="editor-sidebar">
            <div class="card">
              <div class="card-header"><h2 class="card-title">Status</h2></div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Publication Status</label>
                  <select formControlName="status" class="form-input">
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
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
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
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
      position: sticky;
      top: 80px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .form-textarea--lg {
      min-height: 240px;
      resize: vertical;
      font-family: inherit;
    }

    .loading-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }
  `],
})
export class VacancyEditorComponent implements OnInit {
  @Input() id?: string;

  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly isNew = computed(() => !this.id || this.id === 'new');

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      location: [''],
      department: [''],
      employmentType: [''],
      seniority: [''],
      description: ['', Validators.required],
      requirements: [''],
      benefits: [''],
      applyUrl: [''],
      status: [ContentStatus.DRAFT],
    });

    if (!this.isNew()) {
      this.loadVacancy();
    }
  }

  loadVacancy(): void {
    this.loading.set(true);
    this.api.getVacancy(this.id!).subscribe({
      next: (res) => {
        const v = res.data;
        this.form.patchValue({
          title: v.title,
          location: v.location ?? '',
          department: v.department ?? '',
          employmentType: v.employmentType ?? '',
          seniority: v.seniority ?? '',
          description: v.description,
          requirements: v.requirements ?? '',
          benefits: v.benefits ?? '',
          applyUrl: v.applyUrl ?? '',
          status: v.status,
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

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);
    const value = this.form.getRawValue();
    const dto = {
      title: value['title'],
      location: value['location'] || null,
      department: value['department'] || null,
      employmentType: value['employmentType'] || null,
      seniority: value['seniority'] || null,
      description: value['description'],
      requirements: value['requirements'] || null,
      benefits: value['benefits'] || null,
      applyUrl: value['applyUrl'] || null,
      status: value['status'],
    };

    const request$ = this.isNew()
      ? this.api.createVacancy(dto)
      : this.api.updateVacancy(this.id!, dto);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/vacancies']);
      },
      error: () => {
        this.saving.set(false);
        alert('Failed to save vacancy.');
        this.cdr.markForCheck();
      },
    });
  }
}
