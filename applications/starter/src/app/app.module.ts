import { Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/api';

// -------------------------------------- logging --------------------------------------------
// tslint:disable-next-line:no-unused-variable
import { configure, getLogger, ILogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Fluxgate
import { APP_STORE, AppInjector, createStore } from '@fluxgate/client';
import { AppConfig, IAppConfig } from '@fluxgate/common';
import {
  ApplicationErrorHandlerModule,
  AuthenticationModule, AuthenticationNavigation, AuthenticationNavigationToken, AuthenticationRoutingModule,
  AutofocusModule, AutoformModule, ClientServicesModule, ConfirmationDialogModule,
  ENTITY_VERSION_SERVICE_PROVIDER,
  FocusModule, LOGGING_ERROR_HANDLER_OPTIONS, MessagesModule,
  UserServiceRequestsModule
} from '@fluxgate/components';
import { ModuleMetadataStorage } from '@fluxgate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientModule } from './client.module';
import { HomeComponent } from './home/home.component';

// Artikel
import { ArtikelModule } from './artikel/artikel.module';


// Car
// Artikel
import { CarModule } from './car/car.module';
import { ConfigurationModule } from './configuration/configuration.module';
// import { SystemConfigModule } from './systemconfig/systemconfig.module';

export function createAuthenticationNavigation(): AuthenticationNavigation {
  return {
    loginRedirectUrl: '/artikel',
    // logoutRedirectUrl: '/',
    // changePasswordRedirectUrl: '/'
  };
}




// import * as appConfig from './config/config.json';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,

    // fluxgate/client
    ApplicationErrorHandlerModule,
    AutofocusModule,
    AutoformModule,
    ConfirmationDialogModule,
    FocusModule,
    ClientServicesModule,
    MessagesModule,
    UserServiceRequestsModule,

    // lokal
    ArtikelModule,
    CarModule,
    ConfigurationModule,
    AuthenticationModule,
    AuthenticationRoutingModule,
    AppRoutingModule,
  ],
  providers: [
    ENTITY_VERSION_SERVICE_PROVIDER,
    { provide: APP_STORE, useFactory: createStore },
    {
      provide: AuthenticationNavigationToken, useFactory: createAuthenticationNavigation
    },
    {
      provide: LOGGING_ERROR_HANDLER_OPTIONS,
      useValue: {
        rethrowError: false,
        unwrapError: false
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  protected static readonly logger = getLogger(AppModule);

  constructor(router: Router, private injector: Injector) {
    using(new XLog(AppModule.logger, levels.INFO, 'ctor'), (log) => {
      ModuleMetadataStorage.instance.bootstrapModule(ClientModule);

      AppInjector.instance.setInjector(injector);

      const appConfig = require('./config/config.json') as IAppConfig;


      // Anwendungskonfiguration registrieren
      AppConfig.register(appConfig);


      configure((appConfig as any).logging);
      if (log.isInfoEnabled()) {
        log.log(`Routes: ${JSON.stringify(router.config, undefined, 2)}`);
      }
    });
  }
}
