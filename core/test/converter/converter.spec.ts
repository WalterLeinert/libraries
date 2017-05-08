// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import { expect } from 'chai';
import { only, suite, test } from 'mocha-typescript';


import { BOOLEAN_CONVERTER, Converter, ConverterRegistry, DATE_CONVERTER, NUMBER_CONVERTER } from '../../src/converter';
import { InvalidOperationException } from '../../src/exceptions';



class Test {
  @Converter(NUMBER_CONVERTER)
  public id: number;

  public name: string;

  @Converter(BOOLEAN_CONVERTER)
  public persisted: boolean;

  @Converter(DATE_CONVERTER)
  public created: Date;
}

const nullUndefinedTests = [
  NUMBER_CONVERTER,
  BOOLEAN_CONVERTER,
  DATE_CONVERTER
];


const tests = [
  {
    converter: NUMBER_CONVERTER,
    success: {
      to: [
        {
          value: 0,
          expectedValue: '0'
        },
        {
          value: 123,
          expectedValue: '123'
        },
      ],
      from: [
        {
          value: '0',
          expectedValue: 0
        },
        {
          value: '123',
          expectedValue: 123
        },
        {
          value: '-4711',
          expectedValue: -4711
        },
      ]
    },
    failure: {
      to: [
      ],
      from: [
        {
          value: 'Hallo',
          expectedException: InvalidOperationException
        },
        {
          value: '',
          expectedException: InvalidOperationException
        },
        {
          value: '!5',
          expectedException: InvalidOperationException
        },
      ]
    }
  },
  {
    converter: BOOLEAN_CONVERTER,
    success: {
      to: [
        {
          value: true,
          expectedValue: 'true'
        },
        {
          value: false,
          expectedValue: 'false'
        },
      ],
      from: [
        {
          value: 'true',
          expectedValue: true
        },
        {
          value: 'True',
          expectedValue: true
        },
        {
          value: 'false',
          expectedValue: false
        },
        {
          value: 'FALSE',
          expectedValue: false
        },

        {
          value: '1',
          expectedValue: true
        },

        {
          value: '0',
          expectedValue: false
        },
      ]
    },
    failure: {
      to: [
      ],
      from: [
        {
          value: 'Hallo',
          expectedException: InvalidOperationException
        },
        {
          value: '#',
          expectedException: InvalidOperationException
        },
        {
          value: 'tr-ue',
          expectedException: InvalidOperationException
        },
      ]
    }
  },

  {
    converter: DATE_CONVERTER,
    success: {
      to: [
        {
          value: new Date(2017, 4, 8, 0, 0, 0),
          expectedValue: '2017-05-07T22:00:00.000Z'
        },
      ],
      from: [
        {
          value: '2017-04-01T22:00:00.000Z',
          expectedValue: new Date(2017, 3, 2, 0, 0, 0)
        },
      ]
    },
    failure: {
      to: [
      ],
      from: [
      ]
    }
  }
];



@suite('core.converter') @only
class ConverterTest {

  @test 'should convert null/undefined'() {
    nullUndefinedTests.forEach((convKey) => {
      const converter = ConverterRegistry.get(convKey);
      expect(converter.from.convert(null)).to.equal(null);
      expect(converter.to.convert(undefined)).to.equal(undefined);
    });
  }


  @test 'should convert from'() {

    tests.forEach((test) => {
      const converter = ConverterRegistry.get(test.converter);

      for (let data of test.success.from) {
        expect(converter.from.convert(data.value)).to.eql(data.expectedValue);
      }
    });
  }


  @test 'should convert to'() {

    tests.forEach((test) => {
      const converter = ConverterRegistry.get(test.converter);

      for (let data of test.success.to) {
        expect(converter.to.convert(data.value)).to.eql(data.expectedValue);
      }
    });

  }
}



@suite('core.converter (expected exceptions)') @only
class ConverterFailureTest {


  @test 'should convert from and throw exceptions'() {

    tests.forEach((test) => {
      const converter = ConverterRegistry.get(test.converter);

      for (let data of test.failure.from) {
        expect(() => converter.from.convert(data.value)).to.throw(data.expectedException);
      }
    });
  }

}