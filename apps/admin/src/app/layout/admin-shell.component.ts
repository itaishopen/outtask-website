import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthStateService } from '../shared/services/auth-state.service';
import { RoleName } from '@outtask/shared-types';

interface NavItem {
  label: string;
  path: string;
  icon: SafeHtml;
  requiredRole?: RoleName;
}

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="admin-shell" [class.sidebar-collapsed]="sidebarCollapsed()">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <div class="logo-mark">O</div>
            <span class="logo-text" *ngIf="!sidebarCollapsed()">Outtask Admin</span>
          </div>
          <button class="sidebar-toggle" (click)="toggleSidebar()" aria-label="Toggle sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <nav class="sidebar-nav">
          @for (item of visibleNavItems(); track item.path) {
            <a
              class="nav-item"
              [routerLink]="item.path"
              routerLinkActive="active"
              [title]="sidebarCollapsed() ? item.label : ''"
            >
              <span class="nav-icon" [innerHTML]="item.icon"></span>
              <span class="nav-label" *ngIf="!sidebarCollapsed()">{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <button
            class="nav-item nav-item--logout"
            (click)="logout()"
            [title]="sidebarCollapsed() ? 'Sign out' : ''"
          >
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            <span class="nav-label" *ngIf="!sidebarCollapsed()">Sign out</span>
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <div class="main-wrapper">
        <!-- Top bar -->
        <header class="topbar">
          <button
            class="mobile-menu-btn"
            (click)="toggleMobileSidebar()"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div class="topbar-spacer"></div>

          <div class="topbar-user">
            <div class="user-avatar">
              {{ userInitials() }}
            </div>
            <div class="user-info" *ngIf="currentUser()">
              <span class="user-name">{{ currentUser()!.name }}</span>
              <span class="user-role">{{ currentUser()!.role }}</span>
            </div>
          </div>
        </header>

        <!-- Page content -->
        <main class="page-content">
          <router-outlet />
        </main>
      </div>

      <!-- Mobile overlay -->
      <div
        class="mobile-overlay"
        [class.active]="mobileSidebarOpen()"
        (click)="toggleMobileSidebar()"
      ></div>
    </div>
  `,
  styles: [`
    .admin-shell {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }

    /* ─── Sidebar ─────────────────────────────────────────────────────── */
    .sidebar {
      width: 240px;
      background: #0f172a;
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      transition: width 0.2s ease;
      z-index: 100;
    }

    .admin-shell.sidebar-collapsed .sidebar {
      width: 64px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid #1e293b;
      min-height: 64px;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      overflow: hidden;
    }

    .logo-mark {
      width: 32px;
      height: 32px;
      background: #3b82f6;
      color: white;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #f1f5f9;
      white-space: nowrap;
    }

    .sidebar-toggle {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      flex-shrink: 0;

      svg {
        width: 18px;
        height: 18px;
        display: block;
      }

      &:hover {
        color: #94a3b8;
        background: #1e293b;
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 0.75rem 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 6px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background 0.1s, color 0.1s;
      border: none;
      background: none;
      cursor: pointer;
      width: 100%;
      text-align: left;

      &:hover {
        background: #1e293b;
        color: #e2e8f0;
      }

      &.active {
        background: #1e3a5f;
        color: #60a5fa;
      }
    }

    .nav-item--logout:hover {
      background: #2d1b1b;
      color: #fca5a5;
    }

    .nav-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      svg, ::ng-deep svg {
        width: 18px;
        height: 18px;
      }
    }

    .nav-label {
      white-space: nowrap;
      overflow: hidden;
    }

    .sidebar-footer {
      padding: 0.5rem;
      border-top: 1px solid #1e293b;
    }

    /* ─── Main wrapper ────────────────────────────────────────────────── */
    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .topbar {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      gap: 1rem;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      color: #64748b;
      padding: 0.25rem;

      svg {
        width: 20px;
        height: 20px;
        display: block;
      }
    }

    .topbar-spacer {
      flex: 1;
    }

    .topbar-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: #1e3a5f;
      color: #60a5fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.7rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .page-content {
      flex: 1;
      padding: 1.5rem;
    }

    .mobile-overlay {
      display: none;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -240px;
        transition: left 0.2s ease;
      }

      .mobile-menu-btn {
        display: block;
      }

      .mobile-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 90;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;

        &.active {
          opacity: 1;
          pointer-events: auto;
        }
      }
    }
  `],
})
export class AdminShellComponent {
  private readonly authState = inject(AuthStateService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly currentUser = this.authState.currentUser;
  readonly sidebarCollapsed = signal(false);
  readonly mobileSidebarOpen = signal(false);

  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '?';
    return user.name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  });

  private svg(markup: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(markup);
  }

  private readonly allNavItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: this.svg(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`),
    },
    {
      label: 'Pages',
      path: '/pages',
      icon: this.svg(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`),
      requiredRole: RoleName.EDITOR,
    },
    {
      label: 'Blog',
      path: '/blog',
      icon: this.svg(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`),
      requiredRole: RoleName.EDITOR,
    },
    {
      label: 'Vacancies',
      path: '/vacancies',
      icon: this.svg(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`),
      requiredRole: RoleName.EDITOR,
    },
    {
      label: 'Media',
      path: '/media',
      icon: this.svg(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`),
      requiredRole: RoleName.EDITOR,
    },
    {
      label: 'Job Providers',
      path: '/job-providers',
      icon: this.svg(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>`),
      requiredRole: RoleName.ADMIN,
    },
    {
      label: 'Audit Log',
      path: '/audit',
      icon: this.svg(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`),
      requiredRole: RoleName.ADMIN,
    },
  ];

  readonly visibleNavItems = computed(() =>
    this.allNavItems.filter(
      (item) => !item.requiredRole || this.authState.hasRole(item.requiredRole),
    ),
  );

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update((v) => !v);
  }

  logout(): void {
    this.authState.logout();
  }
}
