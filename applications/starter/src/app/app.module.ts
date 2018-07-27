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

import { APP_STORE, AppInjector, createStore, CurrentUserService } from '@fluxgate/client';
import { AppConfig, IAppConfig } from '@fluxgate/common';
import { ENTITY_VERSION_SERVICE_PROVIDER, YearSelectorModule } from '@fluxgate/components';
import { ModuleMetadataStorage } from '@fluxgate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientModule } from './client.module';



// import * as appConfig from './config/config.json';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,

    YearSelectorModule,

    AppRoutingModule
  ],
  providers: [
    ConfirmationService,
    CurrentUserService,
    ENTITY_VERSION_SERVICE_PROVIDER,
    { provide: APP_STORE, useFactory: createStore },
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
