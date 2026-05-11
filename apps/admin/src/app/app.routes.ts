import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { roleGuard } from './shared/guards/role.guard';
import { RoleName } from '@outtask/shared-types';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./auth/auth-callback.component').then((m) => m.AuthCallbackComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-shell.component').then((m) => m.AdminShellComponent),
    canActivate: [MsalGuard, roleGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'pages',
        loadComponent: () =>
          import('./pages/page-list.component').then((m) => m.PageListComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.EDITOR },
      },
      {
        path: 'pages/:id',
        loadComponent: () =>
          import('./pages/page-editor.component').then((m) => m.PageEditorComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.EDITOR },
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./blog/blog-list.component').then((m) => m.BlogListComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.EDITOR },
      },
      {
        path: 'blog/new',
        loadComponent: () =>
          import('./blog/blog-editor.component').then((m) => m.BlogEditorComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.EDITOR },
      },
      {
        path: 'blog/:id',
        loadComponent: () =>
          import('./blog/blog-editor.component').then((m) => m.BlogEditorComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.EDITOR },
      },
      {
        path: 'vacancies',
        loadComponent: () =>
          import('./vacancies/vacancy-list.component').then((m) => m.VacancyListComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.EDITOR },
      },
      {
        path: 'vacancies/new',
        loadComponent: () =>
          import('./vacancies/vacancy-editor.component').then((m) => m.VacancyEditorComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.EDITOR },
      },
      {
        path: 'vacancies/:id',
        loadComponent: () =>
          import('./vacancies/vacancy-editor.component').then((m) => m.VacancyEditorComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.EDITOR },
      },
      {
        path: 'job-providers',
        loadComponent: () =>
          import('./job-providers/job-providers.component').then((m) => m.JobProvidersComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.ADMIN },
      },
      {
        path: 'media',
        loadComponent: () =>
          import('./media/media-library.component').then((m) => m.MediaLibraryComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.EDITOR },
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('./audit/audit-log.component').then((m) => m.AuditLogComponent),
        canActivate: [roleGuard],
        data: { requiredRole: RoleName.ADMIN },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
