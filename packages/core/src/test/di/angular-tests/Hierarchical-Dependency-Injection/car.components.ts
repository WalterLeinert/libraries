// tslint:disable:max-classes-per-file

import { FlxComponent } from '../../../../lib/di/flx-component.decorator';

import {
  CarService, CarService2, CarService3,
  EngineService, EngineService2, TiresService
} from './car.services';

////////// CCarComponent ////////////
@FlxComponent({
  // selector: 'c-car',
  // template: `<div>C: {{description}}</div>`,
  providers: [
    { provide: CarService, useClass: CarService3 }
  ]
})
export class CCarComponent {
  public description: string;
  constructor(carService: CarService) {
    this.description = `${carService.getCar().description} (${carService.name})`;
  }
}

////////// BCarComponent ////////////

@FlxComponent({
  // selector: 'b-car',
  // template: `
  //   <div>B: {{description}}</div>
  //   <c-car></c-car>
  // `,
  providers: [
    { provide: CarService, useClass: CarService2 },
    { provide: EngineService, useClass: EngineService2 }
  ]
})
export class BCarComponent {
  public description: string;
  constructor(carService: CarService) {
    this.description = `${carService.getCar().description} (${carService.name})`;
  }
}

////////// ACarComponent ////////////
@FlxComponent({
  // selector: 'a-car',
  // template: `
  // <div>A: {{description}}</div>
  // <b-car></b-car>`
})
export class ACarComponent {
  public description: string;
  constructor(carService: CarService) {
    this.description = `${carService.getCar().description} (${carService.name})`;
  }
}
////////// CarsComponent ////////////
@FlxComponent({
  // selector: 'my-cars',
  // template: `
  // <h3>Cars</h3>
  // <a-car></a-car>`
})
export class CarsComponent { }

////////////////

export const carComponents = [
  CarsComponent,
  ACarComponent, BCarComponent, CCarComponent
];

// generic car-related services
export const carServices = [
  CarService, EngineService, TiresService
];


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/