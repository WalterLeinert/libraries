import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { YearSelectorModule } from '@fluxgate/components';

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
export class AppModule { }
