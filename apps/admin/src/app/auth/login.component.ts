import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">
          <div class="logo-mark">O</div>
          <span class="logo-text">Outtask</span>
          <span class="logo-badge">Admin</span>
        </div>

        <h1 class="login-title">Sign in to continue</h1>
        <p class="login-subtitle">
          Use your Microsoft account to access the Outtask CMS.
        </p>

        <button class="btn-microsoft" (click)="signIn()">
          <svg class="ms-logo" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
            <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
          </svg>
          Sign in with Microsoft
        </button>

        <p class="login-footer">
          Access is restricted to authorised Outtask staff only.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .login-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      text-align: center;
    }

    .login-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .logo-mark {
      width: 36px;
      height: 36px;
      background: #0f172a;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
    }

    .logo-badge {
      background: #e2e8f0;
      color: #475569;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: 99px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .login-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.5rem;
    }

    .login-subtitle {
      color: #64748b;
      font-size: 0.9rem;
      margin: 0 0 2rem;
      line-height: 1.5;
    }

    .btn-microsoft {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: #0f172a;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;

      &:hover {
        background: #1e293b;
      }

      &:active {
        background: #0a0f1e;
      }
    }

    .ms-logo {
      width: 21px;
      height: 21px;
      flex-shrink: 0;
    }

    .login-footer {
      margin-top: 1.5rem;
      font-size: 0.8rem;
      color: #94a3b8;
    }
  `],
})
export class LoginComponent {
  private readonly msalService = inject(MsalService);
  private readonly router = inject(Router);

  signIn(): void {
    this.msalService.loginRedirect({
      scopes: environment.apiScopes,
    });
  }
}
