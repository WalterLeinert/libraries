// tslint:disable:member-access

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Platform } from '../../src/base/platform';
import { CoreUnitTest } from '../unit-test';


@suite('core.base.Platform')
class PlatformTest extends CoreUnitTest {

  @test 'should run on node'() {
    return expect(Platform.isNode()).to.be.true;
  }

  @test 'should not run in browser'() {
    return expect(Platform.isBrowser()).to.be.false;
  }
}