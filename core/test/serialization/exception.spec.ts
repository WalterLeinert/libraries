// tslint:disable:max-classes-per-file
// tslint:disable:member-access


import { suite, test } from 'mocha-typescript';


import { configure, IConfig } from '../../src/diagnostics';

import { OptimisticLockException } from '../../src/exceptions/optimisticLockException';
import { SerializerBaseTest } from './serializer-base-test';


@suite('core.serialization (exceptions)')
class ExceptionTest extends SerializerBaseTest {

  config: IConfig = {
    appenders: [
    ],

    levels: {
      '[all]': 'WARN',
      'JsonSerializer': 'WARN'
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