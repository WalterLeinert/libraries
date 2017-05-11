// tslint:disable:max-classes-per-file
// tslint:disable:member-access


import { suite, test } from 'mocha-typescript';


import { configure, IConfig } from '../../src/diagnostics';

import {
  OptimisticLockException
} from '../../src/exceptions';
import { SerializerBaseTest } from './serializer-base-test';


@suite('core.serialization (exceptions)')
class ExceptionTest extends SerializerBaseTest {

  config: IConfig = {
    appenders: [
    ],

    levels: {
      '[all]': 'WARN',
      'JsonFormatter': 'WARN'
    }
  };

  @test 'should serialize/deserialize exception'() {
    const value = new OptimisticLockException('test');

    this.checkSerialization(value);
  }

  public before() {
    super.before();

    configure(this.config);
  }
}