// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Funktion } from '../../src/base/objectType';
import { ConverterRegistry } from '../../src/converter';
import { InvalidOperationException } from '../../src/exceptions';
import { ShortTime } from '../../src/types/shortTime';
import { Time } from '../../src/types/time';
import { CoreUnitTest } from '../unit-test';

const nullUndefinedTests = [
  Date
];

interface ISuccessCase {
  back?: boolean;
  value: any;
  expectedValue: any;
}

interface IFailureCase {
  back?: boolean;
  value: any;
  expectedException: any;
}

interface ITestCases {
  type: Funktion | string;
  success: ISuccessCase[];
  failure: IFailureCase[];
}


const tests: ITestCases[] = [
  {
    type: Boolean,
    success: [
      { value: Boolean(true), expectedValue: 'true' },
      { value: Boolean(false), expectedValue: 'false' },
      { value: true, expectedValue: 'true' },
      { value: false, expectedValue: 'false' },
      { back: true, value: 'true', expectedValue: true },
      { back: true, value: 'True', expectedValue: true },
      { back: true, value: '1', expectedValue: true },
      { back: true, value: 'false', expectedValue: false },
      { back: true, value: 'False', expectedValue: false },
      { back: true, value: '0', expectedValue: false }
    ],
    failure: [
      { value: 'XXXXX', expectedException: InvalidOperationException },
      { back: true, value: 10, expectedException: InvalidOperationException },
    ]
  },

  {
    type: 'integer',
    success: [
      { value: -15, expectedValue: '-15' },
      { value: 0, expectedValue: '0' },
      { value: 123, expectedValue: '123' },
      { back: true, value: '4711', expectedValue: 4711 },
      { back: true, value: '-2', expectedValue: -2 },
      { back: true, value: '0', expectedValue: 0 },
    ],
    failure: [
      { value: '1.23', expectedException: InvalidOperationException },
      { back: true, value: 'hallo', expectedException: InvalidOperationException },
    ]
  },


  {
    type: Number,
    success: [
      { value: Number(4711), expectedValue: '4711' },
      { value: Number(-1), expectedValue: '-1' },
      { value: -15, expectedValue: '-15' },
      { value: 0, expectedValue: '0' },
      { value: 123, expectedValue: '123' },
      { value: -1.23, expectedValue: '-1.23' },
      { back: true, value: '4711', expectedValue: 4711 },
      { back: true, value: '-2', expectedValue: -2 },
      { back: true, value: '0', expectedValue: 0 },
    ],
    failure: [
      { value: '1,23', expectedException: InvalidOperationException },
      { back: true, value: 'hallo', expectedException: InvalidOperationException },
    ]
  },

  {
    type: Date,
    success: [
      { value: new Date('2017-04-09T14:02:05.000Z'), expectedValue: '2017-04-09T14:02:05.000Z' }
    ],
    failure: [
      { value: 'invalid-date', expectedException: InvalidOperationException },
      { back: true, value: '2017-04-01YY22:00:00.000Z', expectedException: InvalidOperationException },
    ]
  },

  {
    type: ShortTime,
    success: [
      { value: new ShortTime(19, 15), expectedValue: '19:15' }
    ],
    failure: [
      { value: 4711, expectedException: InvalidOperationException },
      { back: true, value: '31:99', expectedException: InvalidOperationException },
    ]
  },

  {
    type: Time,
    success: [
      { value: new Time(12, 13, 0), expectedValue: '12:13:00' }
    ],
    failure: [
      { value: true, expectedException: InvalidOperationException },
      { back: true, value: '100', expectedException: InvalidOperationException },
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


  @test 'should convert'() {
    tests.forEach((tst) => {
      const converter = ConverterRegistry.get(tst.type);

      for (const data of tst.success) {
        if (data.back && data.back === true) {
          expect(converter.convertBack(data.value)).to.eql(data.expectedValue);
        } else {
          expect(converter.convert(data.value)).to.eql(data.expectedValue);
        }
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
          expect(() => converter.convertBack(data.value),
            `value = ${data.value}, expectedException = ${data.expectedException.name}`)
            .to.throw(data.expectedException);
        } else {
          expect(() => converter.convert(data.value),
            `value = ${data.value}, expectedException = ${data.expectedException.name}`)
            .to.throw(data.expectedException);
        }
      }
    });
  }

}