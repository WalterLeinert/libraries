// tslint:disable:max-classes-per-file

import { Injectable } from 'injection-js';

/// Model ///
export class Car {
  public name = 'Avocado Motors';

  constructor(public engine: Engine, public tires: Tires) { }

  get description() {
    return `${this.name} car with ` +
      `${this.engine.cylinders} cylinders and ${this.tires.make} tires.`;
  }
}


export class Engine {
  public cylinders = 4;
}

export class Tires {
  public make = 'Flintstone';
  public model = 'Square';
}

//// Engine services ///
@Injectable()
export class EngineService {
  public id = 'E1';

  public getEngine() { return new Engine(); }
}

@Injectable()
export class EngineService2 {
  public id = 'E2';

  public getEngine() {
    const eng = new Engine();
    eng.cylinders = 8;
    return eng;
  }
}

//// Tire services ///
@Injectable()
export class TiresService {
  public id = 'T1';

  public getTires() { return new Tires(); }
}

/// Car Services ///
@Injectable()
export class CarService {
  public id = 'C1';

  constructor(protected engineService: EngineService, protected tiresService: TiresService) {
  }

  public getCar() {
    return new Car(
      this.engineService.getEngine(),
      this.tiresService.getTires());
  }

  get name() {
    return `${this.id}-${this.engineService.id}-${this.tiresService.id}`;
  }
}

@Injectable()
export class CarService2 extends CarService {
  public id = 'C2';

  constructor(
    protected engineService: EngineService,
    protected tiresService: TiresService) {
    super(engineService, tiresService);
  }

  public getCar() {
    const car = super.getCar();
    car.name = 'BamBam Motors, BroVan 2000';
    return car;
  }
}

@Injectable()
export class CarService3 extends CarService2 {
  public id = 'C3';

  constructor(
    protected engineService: EngineService,
    protected tiresService: TiresService) {
    super(engineService, tiresService);
  }

  public getCar() {
    const car = super.getCar();
    car.name = 'Chizzamm Motors, Calico UltraMax Supreme';
    return car;
  }
}



/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/