// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ConverterRegistry } from '../../src/converter';
import { InvalidOperationException } from '../../src/exceptions';
import { CoreUnitTest } from '../unit-test';
import { ShortTime } from '../../src/types/shortTime';
import { Time } from '../../src/types/time';

const nullUndefinedTests = [
  Date
];


const tests = [
  {
    type: Date,
    success: [
      {
        value: new Date(2017, 4, 8, 0, 0, 0),
        expectedValue: '2017-05-07T22:00:00.000Z'
      },
      {
        value: new Date(2017, 3, 2, 0, 0, 0),
        expectedValue: '2017-04-01T22:00:00.000Z'
      }
    ],
    failure: [
      {
        back: false,
        value: 'invalid-date',
        expectedException: InvalidOperationException
      },

      {
        back: true,
        value: '2017-04-01YY22:00:00.000Z',
        expectedException: InvalidOperationException
      },
    ]
  },

  {
    type: ShortTime,
    success: [
      {
        value: new ShortTime(19, 15),
        expectedValue: '19:15'
      }
    ],
    failure: [
      {
        back: false,
        value: 4711,
        expectedException: InvalidOperationException
      },

      {
        back: true,
        value: '31:99',
        expectedException: InvalidOperationException
      },
    ]
  },


  {
    type: Time,
    success: [
      {
        value: new Time(12, 13, 0),
        expectedValue: '12:13:00'
      }
    ],
    failure: [
      {
        back: false,
        value: true,
        expectedException: InvalidOperationException
      },

      {
        back: true,
        value: '100',
        expectedException: InvalidOperationException
      },
    ]
  }


];



@suite('core.converter')
class ConverterTest extends CoreUnitTest {

  @test 'should convert null/undefined'() {
    nullUndefinedTests.forEach((type) => {
      const converter = ConverterRegistry.get(type);
      expect(converter.convert(null)).to.equal(null);
      expect(converter.convertBack(undefined)).to.equal(undefined);
    });
  }


  @test 'should convert from'() {
    tests.forEach((tst) => {
      const converter = ConverterRegistry.get(tst.type);

      for (const data of tst.success) {
        expect(converter.convert(data.value)).to.eql(data.expectedValue);
        expect(converter.convertBack(data.expectedValue)).to.eql(data.value);
      }
    });
  }
}


@suite('core.converter (expected exceptions)')
class ConverterFailureTest extends CoreUnitTest {

  @test 'should convert and throw exceptions'() {

    tests.forEach((tst) => {
      const converter = ConverterRegistry.get(tst.type);

      for (const data of tst.failure) {
        if (data.back && data.back === true) {
          expect(() => converter.convertBack(data.value)).to.throw(data.expectedException);
        } else {
          expect(() => converter.convert(data.value)).to.throw(data.expectedException);
        }
      }
    });
  }

}