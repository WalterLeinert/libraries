import { Injector } from 'injection-js';

import { FlxComponent } from '../../../../lib/di/flx-component.decorator';

// -------------------------------------- logging --------------------------------------------
import { using } from '../../../../lib/base/disposable';
import { IConfig } from '../../../../lib/diagnostics/config.interface';
import { levels } from '../../../../lib/diagnostics/level';
import { ILevel } from '../../../../lib/diagnostics/level.interface';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../../../../lib/diagnostics/logger.interface';
import { getLogger } from '../../../../lib/diagnostics/logging-core';
import { XLog } from '../../../../lib/diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { CarsComponent } from './car.components';
import { HeroesListComponent } from './heroes-list.component';
import { VillainsListComponent } from './villains-list.component';
import { VillainsService } from './villains.service';

@FlxComponent({
  // selector: 'my-app',
  // template: `
  //   <label><input type="checkbox" [checked]="showHeroes"   (change)="showHeroes=!showHeroes">Heroes</label>
  //   <label><input type="checkbox" [checked]="showVillains" (change)="showVillains=!showVillains">Villains</label>
  //   <label><input type="checkbox" [checked]="showCars"     (change)="showCars=!showCars">Cars</label>

  //   <h1>Hierarchical Dependency Injection</h1>

  //   <heroes-list   *ngIf="showHeroes"></heroes-list>
  //   <villains-list *ngIf="showVillains"></villains-list>
  //   <my-cars       *ngIf="showCars"></my-cars>
  // `
  providers: [
    VillainsService,
    VillainsListComponent
  ]
})
export class AppComponent {
  protected static readonly logger = getLogger(AppComponent);

  private pshowCars = true;
  private showHeroes = true;
  private showVillains = true;

  constructor(injector: Injector) {
    using(new XLog(AppComponent.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`showHeroes = ${this.showHeroes}`);

      const component = injector.get(VillainsListComponent);
    });
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/