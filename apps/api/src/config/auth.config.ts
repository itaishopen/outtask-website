import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env['JWT_SECRET'] ?? 'CHANGE_ME_IN_PRODUCTION',
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '1h',
  jwtRefreshSecret: process.env['JWT_REFRESH_SECRET'] ?? 'CHANGE_ME_REFRESH_IN_PRODUCTION',
  jwtRefreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
  microsoftClientId: process.env['MICROSOFT_CLIENT_ID'] ?? '',
  microsoftClientSecret: process.env['MICROSOFT_CLIENT_SECRET'] ?? '',
  microsoftTenantId: process.env['MICROSOFT_TENANT_ID'] ?? 'common',
  microsoftRedirectUri: process.env['MICROSOFT_REDIRECT_URI'] ?? 'http://localhost:3000/api/auth/microsoft/callback',
  allowedDomains: (process.env['ALLOWED_EMAIL_DOMAINS'] ?? 'outtask.nl').split(','),
}));
