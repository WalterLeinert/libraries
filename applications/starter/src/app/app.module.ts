import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { YearSelectorModule } from '@fluxgate/components';
import { IAppConfig } from '@fluxgate/common';
import { ModuleMetadataStorage } from '@fluxgate/core';
import { configure } from '@fluxgate/platform';

import { AppComponent } from './app.component';
import { ClientModule } from './client.module';


import * as appConfig from './config/config.json';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // YearSelectorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
    ModuleMetadataStorage.instance.bootstrapModule(ClientModule);


    configure((appConfig as any).logging);
  }
}
