import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export function roleGuard(requiredRoles: string[]): CanActivateFn {
  return () => {
    const router = inject(Router);

    // Auth state service would be injected here in production.
    // The actual role check happens in the admin app's AuthStateService.
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (!token) {
      return router.createUrlTree(['/login']);
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload['role'] as string;

      if (requiredRoles.includes(userRole)) {
        return true;
      }

      return router.createUrlTree(['/dashboard']);
    } catch {
      return router.createUrlTree(['/login']);
    }
  };
}
