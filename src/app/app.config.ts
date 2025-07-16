import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {OktaAuthModule} from '@okta/okta-angular';
import {providePrimeNG} from 'primeng/config';

import { appRoutes } from './app.routes';
import {LbuHttpInterceptor} from '../config/lbu-http-interceptor';
import {oktaModuleConfig} from '../config/lbu-okta.config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    importProvidersFrom(OktaAuthModule.forRoot(oktaModuleConfig)),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'system'
        }
      }
    }),
    {provide: HTTP_INTERCEPTORS, useClass: LbuHttpInterceptor, multi: true}
  ]
};
