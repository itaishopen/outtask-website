import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { API_BASE_URL } from './core/tokens/api.token';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: API_BASE_URL,
      useValue: process.env['API_URL'] ?? 'http://localhost:3000/api',
    },
  ],
};

export const serverConfig = mergeApplicationConfig(appConfig, serverConfig);
