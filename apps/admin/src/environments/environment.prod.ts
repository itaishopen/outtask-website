export const environment = {
  production: true,
  apiUrl: '/api',
  msalConfig: {
    auth: {
      clientId: 'REPLACE_WITH_CLIENT_ID',
      authority: 'https://login.microsoftonline.com/REPLACE_WITH_TENANT_ID',
      redirectUri: 'https://admin.outtask.com/auth/callback',
    },
  },
  apiScopes: ['api://REPLACE_WITH_API_CLIENT_ID/access_as_user'],
};
