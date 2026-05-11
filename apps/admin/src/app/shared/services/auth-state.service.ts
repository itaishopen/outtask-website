import { Injectable, inject, signal, computed } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, AccountInfo } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { RoleName } from '@outtask/shared-types';

export interface CurrentUser {
  email: string;
  name: string;
  role: RoleName;
  accountId: string;
}

function parseJwt(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly msalService = inject(MsalService);
  private readonly broadcastService = inject(MsalBroadcastService);

  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _currentUser = signal<CurrentUser | null>(null);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();

  readonly userRole = computed(() => this._currentUser()?.role ?? null);

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.msalService.instance.initialize().then(() => {
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        this.msalService.instance.setActiveAccount(accounts[0]);
        this.updateUserState(accounts[0]);
      }
    });

    this.broadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS,
        ),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        if (payload?.account) {
          this.msalService.instance.setActiveAccount(payload.account);
          this.updateUserState(payload.account);
          if (payload.accessToken) {
            localStorage.setItem('access_token', payload.accessToken);
          }
        }
      });

    this.broadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGOUT_SUCCESS))
      .subscribe(() => {
        this._isAuthenticated.set(false);
        this._currentUser.set(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      });
  }

  private updateUserState(account: AccountInfo): void {
    const token = localStorage.getItem('access_token');
    let role = RoleName.VIEWER;

    if (token) {
      const claims = parseJwt(token);
      const roleClaim = claims['role'] as string | undefined;
      if (roleClaim && Object.values(RoleName).includes(roleClaim as RoleName)) {
        role = roleClaim as RoleName;
      }
    }

    this._isAuthenticated.set(true);
    this._currentUser.set({
      email: account.username,
      name: account.name ?? account.username,
      role,
      accountId: account.homeAccountId,
    });
  }

  hasRole(role: RoleName): boolean {
    const current = this._currentUser();
    if (!current) return false;
    const hierarchy: RoleName[] = [RoleName.VIEWER, RoleName.EDITOR, RoleName.ADMIN];
    const currentIdx = hierarchy.indexOf(current.role);
    const requiredIdx = hierarchy.indexOf(role);
    return currentIdx >= requiredIdx;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.msalService.logoutRedirect();
  }
}
