import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { RoleName } from '@outtask/shared-types';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const requiredRole = route.data['requiredRole'] as RoleName | undefined;

  if (!authState.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRole && !authState.hasRole(requiredRole)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
