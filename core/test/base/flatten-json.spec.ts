// tslint:disable:member-access

// import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { FlattenJson } from '../../src/base/flatten-json';


const data = {
  name: '@fluxgate/core',
  version: '2.2.6-beta.2',
  description: 'Fluxgate Library Core',
  main: 'dist/src/index.js',
  typings: 'dist/dts/index.d.ts',
  scripts: {
    tslint: 'tslint ./src/**/*.ts'
  },
  repository: {
    type: 'git',
    url: 'http://server.fluxgate.de:89/fluxgate/libraries.git'
  }
};


@suite('core.base.FlattenJson')
class Test {


  @test 'should flatten json'() {
    const flattener = new FlattenJson(data);
    flattener.flatten();
    const result = flattener.result;
    // tslint:disable-next-line:no-console
    console.log(`result = ${JSON.stringify(result)}`);

    // tslint:disable-next-line:no-console
    console.log(`toString: ${flattener.toString()}`);

    // return expect(flattener.flatten()).to.not.throw;
  }
}
