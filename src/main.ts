import 'zone.js';
import '@angular/material/icon';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import {importProvidersFrom} from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimations(), importProvidersFrom(HttpClientModule)]
}).catch(err => console.error(err));
