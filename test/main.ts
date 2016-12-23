import 'reflect-metadata';
import * as Knex from 'knex';

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

let knex: Knex = Knex(null);
knex.schema.createTable('users', function (table) {

    let cols = ['name', 'description'];
    for (let col in cols) {
        table.string(col);
    }

})

