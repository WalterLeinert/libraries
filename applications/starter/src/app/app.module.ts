import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { YearSelectorModule } from '@fluxgate/components';
import { IAppConfig } from '@fluxgate/common';
import { configure } from '@fluxgate/platform';

import { AppComponent } from './app.component';

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
    const appConfig = require('./config/config.json') as IAppConfig;
    configure(appConfig.logging);
  }
}
