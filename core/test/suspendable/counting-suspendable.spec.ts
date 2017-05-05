// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';

import { using } from '../../src/diagnostics/';
import { CountingSuspendable, Suspender } from '../../src/suspendable/';



@suite('core.suspendable.CountingSuspendable') @only
class SuspedableTest {
  private suspendable: CountingSuspendable = new CountingSuspendable();

  @test 'should create test increment and counter (increment = 1)'() {
    this.suspendable = new CountingSuspendable();

    using(new Suspender([this.suspendable]), () => {
      expect(this.suspendable.Counter).to.equal(1);

      using(new Suspender([this.suspendable]), () => {
        expect(this.suspendable.Counter).to.equal(2);

        using(new Suspender([this.suspendable]), () => {
          expect(this.suspendable.Counter).to.equal(3);
        });

        expect(this.suspendable.Counter).to.equal(2);
      });

      expect(this.suspendable.Counter).to.equal(1);
    });
  }

  @test 'should create test increment and counter (increment = 10)'() {
    this.suspendable = new CountingSuspendable(10);

    using(new Suspender([this.suspendable]), () => {
      expect(this.suspendable.Counter).to.equal(10);

      using(new Suspender([this.suspendable]), () => {
        expect(this.suspendable.Counter).to.equal(20);

        using(new Suspender([this.suspendable]), () => {
          expect(this.suspendable.Counter).to.equal(30);
        });

        expect(this.suspendable.Counter).to.equal(20);
      });

      expect(this.suspendable.Counter).to.equal(10);
    });
  }
}