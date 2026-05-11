export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  msalConfig: {
    auth: {
      clientId: 'REPLACE_WITH_CLIENT_ID',
      authority: 'https://login.microsoftonline.com/REPLACE_WITH_TENANT_ID',
      redirectUri: 'http://localhost:4201/auth/callback',
    },
  },
  apiScopes: ['api://REPLACE_WITH_API_CLIENT_ID/access_as_user'],
};
