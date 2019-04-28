// tslint:disable:max-classes-per-file
// tslint:disable:member-access


import { skip, suite, test } from 'mocha-typescript';


import { configure, IConfig } from '../../lib/diagnostics';

import { OptimisticLockException } from '../../lib/exceptions/optimisticLockException';
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

  @skip   // TODO: fix
  @test 'should serialize/deserialize exception'() {
    const value = new OptimisticLockException('test');

    this.checkSerialization(value);
  }

  public before() {
    super.before();

    configure(this.config);
  }
}