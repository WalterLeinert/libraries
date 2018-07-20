import { FlxModule } from '../../../../lib/di/flx-module.decorator';

import { AppComponent } from './app.component';
import { HeroTaxReturnComponent } from './hero-tax-return.component';
import { HeroesListComponent } from './heroes-list.component';
import { HeroesService } from './heroes.service';
import { VillainsListComponent } from './villains-list.component';

import { carComponents, carServices } from './car.components';

@FlxModule({
  imports: [
    // BrowserModule,
    // FormsModule
  ],
  providers: [
    carServices,
    HeroesService
  ],
  declarations: [
    AppComponent,
    carComponents,
    HeroesListComponent,
    HeroTaxReturnComponent,
    VillainsListComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/