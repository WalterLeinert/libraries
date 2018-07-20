// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { using } from '../../lib/diagnostics/';
import { CountingSuspendable, Suspender } from '../../lib/suspendable/';
import { CoreUnitTest } from '../unit-test';



@suite('core.suspendable.CountingSuspendable')
class SuspedableTest extends CoreUnitTest {
  private suspendable: CountingSuspendable = new CountingSuspendable();

  @test 'should create test increment and counter (increment = 1)'() {
    this.suspendable = new CountingSuspendable();

    using(new Suspender([this.suspendable]), () => {
      expect(this.suspendable.counter).to.equal(1);

      using(new Suspender([this.suspendable]), () => {
        expect(this.suspendable.counter).to.equal(2);

        using(new Suspender([this.suspendable]), () => {
          expect(this.suspendable.counter).to.equal(3);
        });

        expect(this.suspendable.counter).to.equal(2);
      });

      expect(this.suspendable.counter).to.equal(1);
    });
  }

  @test 'should create test increment and counter (increment = 10)'() {
    this.suspendable = new CountingSuspendable(10);

    using(new Suspender([this.suspendable]), () => {
      expect(this.suspendable.counter).to.equal(10);

      using(new Suspender([this.suspendable]), () => {
        expect(this.suspendable.counter).to.equal(20);

        using(new Suspender([this.suspendable]), () => {
          expect(this.suspendable.counter).to.equal(30);
        });

        expect(this.suspendable.counter).to.equal(20);
      });

      expect(this.suspendable.counter).to.equal(10);
    });
  }
}