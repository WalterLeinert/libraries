
import 'reflect-metadata';
import { Activator } from '@fluxgate/common';

class Test {
    constructor(name: string, id: number) {

    }
}

class Main {

    static run() {

        Activator.createInstance<Test>(Test, "Hugo", 12);
    }
}


Main.run();

