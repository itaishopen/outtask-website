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
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminApiService } from '../shared/services/admin-api.service';
import { Page, PageSection, SectionType, ContentStatus } from '@outtask/shared-types';

interface SectionTypeDef {
  type: SectionType;
  label: string;
  fields: SectionFieldDef[];
}

interface SectionFieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'boolean';
  options?: string[];
}

const SECTION_TYPES: SectionTypeDef[] = [
  {
    type: SectionType.HERO,
    label: 'Hero',
    fields: [
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'subheadline', label: 'Subheadline', type: 'text' },
      { key: 'backgroundImage', label: 'Background Image URL', type: 'text' },
    ],
  },
  {
    type: SectionType.TEXT_IMAGE,
    label: 'Text + Image',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'image', label: 'Image URL', type: 'text' },
      { key: 'imagePosition', label: 'Image Position', type: 'select', options: ['left', 'right'] },
    ],
  },
  {
    type: SectionType.CARDS,
    label: 'Cards',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'columns', label: 'Columns', type: 'select', options: ['2', '3', '4'] },
    ],
  },
  {
    type: SectionType.TESTIMONIALS,
    label: 'Testimonials',
    fields: [{ key: 'heading', label: 'Heading', type: 'text' }],
  },
  {
    type: SectionType.CTA,
    label: 'Call to Action',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'subheading', label: 'Subheading', type: 'text' },
      { key: 'style', label: 'Style', type: 'select', options: ['light', 'dark', 'brand'] },
    ],
  },
  {
    type: SectionType.RICH_TEXT,
    label: 'Rich Text',
    fields: [
      { key: 'content', label: 'Content (HTML)', type: 'textarea' },
      { key: 'maxWidth', label: 'Max Width', type: 'select', options: ['sm', 'md', 'lg', 'full'] },
    ],
  },
  {
    type: SectionType.VACANCY_LIST,
    label: 'Vacancy List',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'limit', label: 'Limit', type: 'number' },
      { key: 'showFilters', label: 'Show Filters', type: 'boolean' },
    ],
  },
  {
    type: SectionType.BLOG_LIST,
    label: 'Blog List',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'limit', label: 'Limit', type: 'number' },
    ],
  },
  {
    type: SectionType.LOGO_CLOUD,
    label: 'Logo Cloud',
    fields: [{ key: 'heading', label: 'Heading', type: 'text' }],
  },
  {
    type: SectionType.FAQ,
    label: 'FAQ',
    fields: [{ key: 'heading', label: 'Heading', type: 'text' }],
  },
];

@Component({
  selector: 'app-page-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-editor">
      <div class="page-header">
        <div class="breadcrumb">
          <a routerLink="/pages" class="breadcrumb-link">Pages</a>
          <span class="breadcrumb-sep">/</span>
          <span>{{ isNew() ? 'New Page' : form.get('title')?.value || 'Edit Page' }}</span>
        </div>
        <div class="header-actions">
          <a routerLink="/pages" class="btn btn-ghost">Cancel</a>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
            {{ saving() ? 'Saving…' : 'Save Page' }}
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-state">Loading&hellip;</div>
      } @else {
        <form [formGroup]="form" class="editor-layout">
          <!-- Main column -->
          <div class="editor-main">
            <!-- Page details -->
            <div class="card">
              <div class="card-header"><h2 class="card-title">Page Details</h2></div>
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label">Title <span class="required">*</span></label>
                  <input type="text" formControlName="title" class="form-input" placeholder="My awesome page" (input)="onTitleInput()" />
                  @if (form.get('title')?.invalid && form.get('title')?.touched) {
                    <span class="form-error">Title is required</span>
                  }
                </div>

                <div class="form-group">
                  <label class="form-label">Slug <span class="required">*</span></label>
                  <div class="input-prefix-group">
                    <span class="input-prefix">/</span>
                    <input type="text" formControlName="slug" class="form-input" placeholder="my-awesome-page" />
                  </div>
                  @if (form.get('slug')?.invalid && form.get('slug')?.touched) {
                    <span class="form-error">Slug is required</span>
                  }
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">SEO Title</label>
                    <input type="text" formControlName="seoTitle" class="form-input" placeholder="SEO title" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Locale</label>
                    <input type="text" formControlName="locale" class="form-input" placeholder="en" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">SEO Description</label>
                  <textarea formControlName="seoDesc" class="form-input form-textarea" placeholder="Meta description for search engines" rows="2"></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">OG Image URL</label>
                  <input type="text" formControlName="ogImage" class="form-input" placeholder="https://..." />
                </div>
              </div>
            </div>

            <!-- Sections builder -->
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Sections</h2>
                <div class="add-section-area">
                  <select class="form-input form-input--sm" [(ngModel)]="selectedSectionType" [ngModelOptions]="{standalone: true}">
                    <option value="">Choose type…</option>
                    @for (st of sectionTypes; track st.type) {
                      <option [value]="st.type">{{ st.label }}</option>
                    }
                  </select>
                  <button type="button" class="btn btn-secondary btn-sm" (click)="addSection()" [disabled]="!selectedSectionType">
                    Add Section
                  </button>
                </div>
              </div>
              <div class="card-body">
                @if (sectionsArray.length === 0) {
                  <div class="empty-state">No sections yet. Add one above.</div>
                } @else {
                  <div class="sections-list" formArrayName="sections">
                    @for (section of sectionsArray.controls; track $index; let i = $index) {
                      <div class="section-item" [formGroupName]="i">
                        <div class="section-header" (click)="toggleSection(i)">
                          <div class="section-meta">
                            <span class="section-type-badge">{{ getSectionLabel(getSectionType(i)) }}</span>
                            <span class="section-order">Section {{ i + 1 }}</span>
                          </div>
                          <div class="section-controls">
                            <button type="button" class="icon-btn" (click)="moveSection(i, -1); $event.stopPropagation()" [disabled]="i === 0" title="Move up">↑</button>
                            <button type="button" class="icon-btn" (click)="moveSection(i, 1); $event.stopPropagation()" [disabled]="i === sectionsArray.length - 1" title="Move down">↓</button>
                            <button type="button" class="icon-btn icon-btn--danger" (click)="removeSection(i); $event.stopPropagation()" title="Delete">×</button>
                            <span class="section-chevron" [class.open]="expandedSections().has(i)">›</span>
                          </div>
                        </div>

                        @if (expandedSections().has(i)) {
                          <div class="section-config">
                            @for (field of getSectionFields(getSectionType(i)); track field.key) {
                              <div class="form-group">
                                <label class="form-label">{{ field.label }}</label>
                                @if (field.type === 'textarea') {
                                  <textarea [formControlName]="'config_' + field.key" class="form-input form-textarea" rows="3"></textarea>
                                } @else if (field.type === 'select') {
                                  <select [formControlName]="'config_' + field.key" class="form-input">
                                    <option value="">— None —</option>
                                    @for (opt of field.options; track opt) {
                                      <option [value]="opt">{{ opt }}</option>
                                    }
                                  </select>
                                } @else if (field.type === 'boolean') {
                                  <label class="toggle-label">
                                    <input type="checkbox" [formControlName]="'config_' + field.key" class="toggle-input" />
                                    <span class="toggle-text">Enabled</span>
                                  </label>
                                } @else {
                                  <input [type]="field.type === 'number' ? 'number' : 'text'" [formControlName]="'config_' + field.key" class="form-input" />
                                }
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
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
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: sticky;
      top: 80px;
    }

    .add-section-area {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .sections-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .section-item {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      cursor: pointer;
      user-select: none;

      &:hover {
        background: #f1f5f9;
      }
    }

    .section-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .section-type-badge {
      font-size: 0.75rem;
      font-weight: 600;
      background: #e0f2fe;
      color: #0369a1;
      padding: 0.2rem 0.5rem;
      border-radius: 99px;
    }

    .section-order {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .section-controls {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .section-chevron {
      font-size: 1.2rem;
      color: #94a3b8;
      transition: transform 0.15s;
      display: inline-block;

      &.open {
        transform: rotate(90deg);
      }
    }

    .icon-btn {
      width: 28px;
      height: 28px;
      background: none;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      cursor: pointer;
      color: #64748b;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover:not(:disabled) {
        background: #f1f5f9;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &.icon-btn--danger:hover:not(:disabled) {
        background: #fee2e2;
        border-color: #fca5a5;
        color: #dc2626;
      }
    }

    .section-config {
      padding: 1rem;
      background: white;
      border-top: 1px solid #e2e8f0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;

      .form-group:has(textarea) {
        grid-column: 1 / -1;
      }

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .input-prefix-group {
      display: flex;
      align-items: center;
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
      font-size: 0.9rem;
    }

    .input-prefix + .form-input {
      border-radius: 0 6px 6px 0;
    }

    .toggle-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .loading-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }

    .empty-state {
      color: #94a3b8;
      font-size: 0.875rem;
      padding: 2rem;
      text-align: center;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  `],
})
export class PageEditorComponent implements OnInit {
  @Input() id?: string;

  private readonly api = inject(AdminApiService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly sectionTypes = SECTION_TYPES;
  selectedSectionType = '';
  readonly expandedSections = signal(new Set<number>());

  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly isNew = computed(() => !this.id || this.id === 'new');

  form!: FormGroup;

  get sectionsArray(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      locale: ['en'],
      seoTitle: [''],
      seoDesc: [''],
      ogImage: [''],
      status: [ContentStatus.DRAFT],
      sections: this.fb.array([]),
    });

    if (!this.isNew()) {
      this.loadPage();
    }
  }

  loadPage(): void {
    this.loading.set(true);
    this.api.getPage(this.id!).subscribe({
      next: (res) => {
        const p = res.data;
        this.form.patchValue({
          title: p.title,
          slug: p.slug,
          locale: p.locale,
          seoTitle: p.seoTitle ?? '',
          seoDesc: p.seoDesc ?? '',
          ogImage: p.ogImage ?? '',
          status: p.status,
        });
        const sorted = [...p.sections].sort((a, b) => a.order - b.order);
        sorted.forEach((s) => this.addSectionFromData(s));
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

  addSection(): void {
    if (!this.selectedSectionType) return;
    const typeDef = SECTION_TYPES.find((t) => t.type === this.selectedSectionType);
    if (!typeDef) return;

    const controls: Record<string, unknown> = {
      type: [this.selectedSectionType],
      order: [this.sectionsArray.length],
    };
    typeDef.fields.forEach((f) => {
      controls[`config_${f.key}`] = [''];
    });

    this.sectionsArray.push(this.fb.group(controls));
    const idx = this.sectionsArray.length - 1;
    this.expandedSections.update((s) => new Set([...s, idx]));
    this.selectedSectionType = '';
    this.cdr.markForCheck();
  }

  addSectionFromData(section: PageSection): void {
    const typeDef = SECTION_TYPES.find((t) => t.type === section.type);
    const controls: Record<string, unknown> = {
      type: [section.type],
      order: [section.order],
    };
    if (typeDef) {
      typeDef.fields.forEach((f) => {
        controls[`config_${f.key}`] = [(section.config as Record<string, unknown>)[f.key] ?? ''];
      });
    }
    this.sectionsArray.push(this.fb.group(controls));
  }

  removeSection(index: number): void {
    this.sectionsArray.removeAt(index);
    this.expandedSections.update((s) => {
      const next = new Set<number>();
      s.forEach((i) => { if (i !== index) next.add(i > index ? i - 1 : i); });
      return next;
    });
    this.cdr.markForCheck();
  }

  moveSection(index: number, direction: number): void {
    const target = index + direction;
    if (target < 0 || target >= this.sectionsArray.length) return;
    const a = this.sectionsArray.at(index);
    const b = this.sectionsArray.at(target);
    this.sectionsArray.setControl(index, b);
    this.sectionsArray.setControl(target, a);
    this.cdr.markForCheck();
  }

  toggleSection(index: number): void {
    this.expandedSections.update((s) => {
      const next = new Set(s);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  getSectionType(index: number): SectionType {
    return this.sectionsArray.at(index).get('type')?.value as SectionType;
  }

  getSectionLabel(type: SectionType): string {
    return SECTION_TYPES.find((t) => t.type === type)?.label ?? type;
  }

  getSectionFields(type: SectionType): SectionFieldDef[] {
    return SECTION_TYPES.find((t) => t.type === type)?.fields ?? [];
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);
    const value = this.form.getRawValue();
    const sections = (value.sections as Record<string, unknown>[]).map((s, i) => {
      const typeDef = SECTION_TYPES.find((t) => t.type === s['type']);
      const config: Record<string, unknown> = {};
      typeDef?.fields.forEach((f) => {
        config[f.key] = s[`config_${f.key}`];
      });
      return { type: s['type'], order: i, config };
    });

    const dto = {
      title: value['title'],
      slug: value['slug'],
      locale: value['locale'],
      seoTitle: value['seoTitle'] || null,
      seoDesc: value['seoDesc'] || null,
      ogImage: value['ogImage'] || null,
      status: value['status'],
    };

    const request$ = this.isNew()
      ? this.api.createPage(dto)
      : this.api.updatePage(this.id!, dto);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/pages']);
      },
      error: (err) => {
        console.error('Save failed', err);
        this.saving.set(false);
        alert('Failed to save page.');
        this.cdr.markForCheck();
      },
    });
  }
}
