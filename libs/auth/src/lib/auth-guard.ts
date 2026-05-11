import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const authGuard: CanActivateFn = (route, state) => {
  const msalGuard = inject(MsalGuard);
  const router = inject(Router);

  try {
    return msalGuard.canActivate(route, state);
  } catch {
    return router.createUrlTree(['/login']);
  }
};
