// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { ShortTime, Types } from '../../src/types';

const expedtedTimes = [
  {
    time: new ShortTime(0, 0),
    text: '00:00'
  },
  {
    time: new ShortTime(8, 30),
    text: '08:30'
  },
  {
    time: new ShortTime(18, 0),
    text: '18:00'
  },
  {
    time: new ShortTime(23, 59),
    text: '23:59'
  }
];


@suite('ShortTime (HH:mm)')
class ShortTimeTest {

  @test 'should create instance of class ShortTime (default ctor)'() {
    return expect(Types.construct(ShortTime)).to.be.not.null;
  }

  @test 'should create instance of class ShortTime'() {
    return expect(new ShortTime(8, 0)).to.be.not.null;
  }

  @test 'should format times'() {
    expedtedTimes.forEach((test) => {
      expect(test.time.toString()).to.equal(test.text);
    });
  }

  @test 'should parse times'() {
    expedtedTimes.forEach((test) => {
      expect(ShortTime.parse(test.text)).to.deep.equal(test.time);
    });
  }

  @test 'should createFrom obj'() {
    const timeObj = {
      hour: 12,
      minute: 10
    };

    expect(ShortTime.createFrom(timeObj).hour).to.equal(timeObj.hour);
    expect(ShortTime.createFrom(timeObj).minute).to.equal(timeObj.minute);
  }

  @test 'should throw exceptions from createFromj'() {
    expect(() => ShortTime.createFrom({
    })).to.throw(Error, 'Property hour, minute fehlt');

    expect(() => ShortTime.createFrom({
      hour: 12
    })).to.throw(Error, 'Property minute fehlt.');

    expect(() => ShortTime.createFrom({
      hour: 12,
      minute: 15
    })).to.not.throw;
  }

  @test 'should allow 00 seconds'() {
    const time = '12:11';
    expect(ShortTime.parse(`${time}:00`).toString()).to.be.equal(time);
  }

  @test 'should not allow ss seconds'() {
    const time = '12:11:33';
    expect(() => ShortTime.parse(time))
      .to.throw(Error, `Zeit ${time}: Falls Sekunden angegeben sind, darf der Wert nur 00 sein.`);
  }



  @test 'should throw an exception for 60 minutes '() {
    return expect(() => new ShortTime(8, 60)).to.throw(Error);
  }

  @test 'should throw an exception for -1 minutes'() {
    return expect(() => new ShortTime(8, -1)).to.throw(Error);
  }

}



function timeToMinute(time: ShortTime): number {
  return time.hour * 60 + time.minute;
}


@suite('ShortTime (add, subtract)')
class ShortTimeOperationsTest {

  @test 'should get minutes from hour'() {
    const time = new ShortTime(8, 0);
    return expect(time.toMinutes()).to.equal(timeToMinute(time));
  }

  @test 'should get minutes from minute'() {
    const time = new ShortTime(0, 10);
    return expect(time.toMinutes()).to.equal(timeToMinute(time));
  }

  @test 'should get hours'() {
    const time = new ShortTime(0, 10);
    return expect(time.toHours()).to.be.closeTo(time.toMinutes() / 60, 0.05);
  }

  @test 'should get hours 2'() {
    const time = new ShortTime(12, 15);
    return expect(time.toHours()).to.be.closeTo(time.toMinutes() / 60, 0.05);
  }

  @test 'should get hours rounded to 2 decimal places'() {
    const time = new ShortTime(12, 15);
    return expect(time.toHours(2)).to.equal(12.25);
  }

  @test 'should get hours rounded to 3 decimal places'() {
    const time = new ShortTime(12, 11);
    return expect(time.toHours(3)).to.equal(12.183);
  }



  @test 'should get time from minutes'() {
    const time = new ShortTime(12, 15);
    return expect(ShortTime.createFromMinutes(time.toMinutes())).to.deep.equal(time);
  }

  @test 'should get time from seconds -> Exception'() {
    const time = new ShortTime(23, 59);
    return expect(() => ShortTime.createFromMinutes(time.toMinutes() + 1)).to.throw(Error);
  }

  @test 'should add times'() {
    const time1 = new ShortTime(12, 0);
    const time2 = new ShortTime(1, 30);
    const result = time1.add(time2);
    const expected = new ShortTime(13, 30);

    return expect(result).to.deep.equal(expected);
  }

  @test 'should subtract times'() {
    const time1 = new ShortTime(12, 0);
    const time2 = new ShortTime(1, 30);
    const result = time1.subtract(time2);
    const expected = new ShortTime(10, 30);

    return expect(result).to.deep.equal(expected);
  }


  @test 'should add times -> Exception'() {
    const time1 = new ShortTime(23, 59);
    const time2 = new ShortTime(1, 30);
    return expect(() => time1.add(time2)).to.throw(Error);
  }

  @test 'should subtract times -> Exception'() {
    const time1 = new ShortTime(0, 0);
    const time2 = new ShortTime(1, 30);
    return expect(() => time1.subtract(time2)).to.throw(Error);
  }

}