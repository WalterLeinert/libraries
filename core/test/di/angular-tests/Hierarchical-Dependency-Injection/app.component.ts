import { FlxComponent } from '../../../../src/di/flx-component.decorator';

// -------------------------------------- logging --------------------------------------------
import { using } from '../../../../src/base/disposable';
import { IConfig } from '../../../../src/diagnostics/config.interface';
import { levels } from '../../../../src/diagnostics/level';
import { ILevel } from '../../../../src/diagnostics/level.interface';
// tslint:disable-next-line:no-unused-variable
import { ILogger } from '../../../../src/diagnostics/logger.interface';
import { configure, getLogger } from '../../../../src/diagnostics/logging-core';
import { XLog } from '../../../../src/diagnostics/xlog';
// -------------------------------------- logging --------------------------------------------


import { CarsComponent } from './car.components';
import { HeroesListComponent } from './heroes-list.component';
import { VillainsListComponent } from './villains-list.component';


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
})
export class AppComponent {
  protected static readonly logger = getLogger(AppComponent);

  private pshowCars = true;
  private showHeroes = true;
  private showVillains = true;

  constructor(heroesList: HeroesListComponent, villainsList: VillainsListComponent, cars: CarsComponent) {
    using(new XLog(AppComponent.logger, levels.INFO, 'ctor'), (log) => {
      log.log(`showHeroes = ${this.showHeroes}`);
    });
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/