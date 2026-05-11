import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

// Using OIDC approach via authorization code flow
// The frontend (admin app) uses MSAL directly and sends the access token
// The backend validates it via jwks-rsa or uses the token to call MS Graph
// This strategy handles the authorization code callback for server-side flow

interface OIDCProfile {
  oid?: string;
  sub?: string;
  email?: string;
  preferred_username?: string;
  name?: string;
  displayName?: string;
}

interface OIDCStrategyOptions {
  identityMetadata: string;
  clientID: string;
  clientSecret: string;
  responseType: string;
  responseMode: string;
  redirectUrl: string;
  allowHttpForRedirectUrl: boolean;
  validateIssuer: boolean;
  passReqToCallback: boolean;
}

type VerifyCallback = (err: Error | null, user?: unknown) => void;

type OIDCCtor = new (options: OIDCStrategyOptions, verify: (profile: OIDCProfile, done: VerifyCallback) => void) => unknown;

class FallbackStrategy {}

// Dynamic import to handle optional passport-azure-ad dependency
let OIDCStrategy: OIDCCtor = FallbackStrategy as unknown as OIDCCtor;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const azureAd = require('passport-azure-ad') as { OIDCStrategy: OIDCCtor };
  OIDCStrategy = azureAd.OIDCStrategy;
} catch {
  Logger.warn('passport-azure-ad not available, Microsoft SSO disabled', 'MicrosoftStrategy');
}

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class MicrosoftStrategy extends PassportStrategy(
  OIDCStrategy as any,
  'microsoft',
) {
  constructor(private config: ConfigService) {
    const tenantId = config.get<string>('auth.microsoftTenantId', 'common');
    super({
      identityMetadata: `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`,
      clientID: config.get<string>('auth.microsoftClientId', ''),
      clientSecret: config.get<string>('auth.microsoftClientSecret', ''),
      responseType: 'code',
      responseMode: 'form_post',
      redirectUrl: config.get<string>('auth.microsoftRedirectUri', ''),
      allowHttpForRedirectUrl: config.get<string>('app.nodeEnv') !== 'production',
      validateIssuer: false,
      passReqToCallback: false,
    });
  }

  async validate(profile: OIDCProfile, done: VerifyCallback) {
    const microsoftProfile = {
      oid: profile.oid ?? profile.sub ?? '',
      email: profile.email ?? profile.preferred_username ?? '',
      name: profile.displayName ?? profile.name ?? '',
    };
    done(null, microsoftProfile);
  }
}
