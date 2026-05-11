import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'en',
    pathMatch: 'full',
  },
  {
    path: 'en',
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
        title: 'Outtask — IT Staffing & Nearshoring Partner',
      },
      {
        path: 'services',
        children: [
          {
            path: 'staffing',
            loadComponent: () =>
              import('./features/services/staffing/staffing.component').then(
                (m) => m.StaffingComponent,
              ),
            title: 'IT Staffing — Outtask',
          },
          {
            path: 'nearshoring',
            loadComponent: () =>
              import('./features/services/nearshoring/nearshoring.component').then(
                (m) => m.NearshoringComponent,
              ),
            title: 'Nearshoring — Outtask',
          },
        ],
      },
      {
        path: 'working-at-outtask',
        loadComponent: () =>
          import('./features/working-at-outtask/working-at-outtask.component').then(
            (m) => m.WorkingAtOuttaskComponent,
          ),
        title: 'Working at Outtask',
      },
      {
        path: 'expats',
        loadComponent: () =>
          import('./features/expats/expats.component').then((m) => m.ExpatsComponent),
        title: 'Expats — Outtask',
      },
      {
        path: 'happy-people',
        loadComponent: () =>
          import('./features/happy-people/happy-people.component').then(
            (m) => m.HappyPeopleComponent,
          ),
        title: 'Happy People — Outtask',
      },
      {
        path: 'hire-a-developer',
        loadComponent: () =>
          import('./features/hire-a-developer/hire-a-developer.component').then(
            (m) => m.HireADeveloperComponent,
          ),
        title: 'Hire a Developer — Outtask',
      },
      {
        path: 'roles/:role',
        loadComponent: () =>
          import('./features/roles/role-landing.component').then((m) => m.RoleLandingComponent),
      },
      {
        path: 'vacancies',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/vacancies/vacancy-list/vacancy-list.component').then(
                (m) => m.VacancyListComponent,
              ),
            title: 'Vacancies — Outtask',
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/vacancies/vacancy-detail/vacancy-detail.component').then(
                (m) => m.VacancyDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'blog',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/blog/blog-list/blog-list.component').then(
                (m) => m.BlogListComponent,
              ),
            title: 'Blog — Outtask',
          },
          {
            path: ':slug',
            loadComponent: () =>
              import('./features/blog/blog-detail/blog-detail.component').then(
                (m) => m.BlogDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
        title: 'Contact — Outtask',
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
        title: 'Page not found — Outtask',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'en',
  },
];
