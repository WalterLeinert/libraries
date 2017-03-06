import 'reflect-metadata';

import { Activator } from '@fluxgate/common';

class Test {
  constructor(name: string, id: number) {
    // ok
  }
}

// tslint:disable-next-line:max-classes-per-file
class Main {

  public static run() {
    Activator.createInstance<Test>(Test, 'Hugo', 12);
  }
}


Main.run();