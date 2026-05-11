import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="callback-page">
      <div class="callback-card">
        <div class="spinner"></div>
        <p class="callback-text">Completing sign in&hellip;</p>
        <p class="callback-sub">Please wait while we verify your credentials.</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .callback-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      min-width: 280px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #0f172a;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .callback-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 0.5rem;
    }

    .callback-sub {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
    }
  `],
})
export class AuthCallbackComponent implements OnInit {
  private readonly msalService = inject(MsalService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.msalService.instance
      .handleRedirectPromise()
      .then((result) => {
        if (result?.accessToken) {
          localStorage.setItem('access_token', result.accessToken);
        }
        this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        console.error('Auth callback error:', error);
        this.router.navigate(['/login']);
      });
  }
}
