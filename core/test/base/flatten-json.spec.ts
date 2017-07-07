// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { FlattenJson } from '../../src/base/flatten-json';
import { UnitTest } from '../../src/testing/unit-test';

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

const expectedResult = `description: "Fluxgate Library Core"
main: "dist/src/index.js"
name: "@fluxgate/core"
repository.type: "git"
repository.url: "http://server.fluxgate.de:89/fluxgate/libraries.git"
scripts.tslint: "tslint ./src/**/*.ts"
typings: "dist/dts/index.d.ts"
version: "2.2.6-beta.2"
`;


@suite('core.base.FlattenJson')
class Test extends UnitTest {


  @test 'should flatten json'() {
    const flattener = new FlattenJson(data);
    flattener.flatten();
    // const result = flattener.result;
    // tslint:disable-next-line:no-console
    // console.log(`result = ${Core.stringify(result)}`);

    // tslint:disable-next-line:no-console
    // console.log(`toString: ${flattener.toString()}`);

    return expect(flattener.toString()).to.equals(expectedResult);
  }
}
