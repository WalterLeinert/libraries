import { ReflectiveInjector } from 'injection-js';

import { Logger } from '../logger.service';
import { Car, Engine, Tires } from './car';

export function useInjector() {
  let injector: ReflectiveInjector;
  /*
  // Cannot instantiate an ReflectiveInjector like this!
  let injector = new ReflectiveInjector([Car, Engine, Tires]);
  */
  injector = ReflectiveInjector.resolveAndCreate([Car, Engine, Tires]);
  const car = injector.get(Car);
  car.description = 'Injector';

  injector = ReflectiveInjector.resolveAndCreate([Logger]);
  const logger = injector.get(Logger);
  logger.log('Injector car.drive() said: ' + car.drive());
  return car;
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/