require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionError } from '../../src/util';

import { Time } from '../../src/types/time';

let expedtedTimes = [
    {
        time: new Time(0, 0, 0),
        text: '00:00:00'
    },
    {
        time: new Time(8, 30, 0),
        text: '08:30:00'
    },
    {
        time: new Time(18, 0, 15),
        text: '18:00:15'
    },
    {
        time: new Time(23, 59, 59),
        text: '23:59:59'
    }
];


@suite('Time (HH:mm:ss)')
class TimeTest {

    @test 'should create instance of class Time'() {
        return expect(new Time(8, 0, 0)).to.be.not.null;
    }

    @test 'should format times'() {
        expedtedTimes.forEach(test => {
            expect(test.time.toString()).to.equal(test.text);
        });
    }

    @test 'should parse times'() {
        expedtedTimes.forEach(test => {
            expect(Time.parse(test.text)).to.deep.equal(test.time);
        });
    }

    @test 'should createFrom obj'() {
        let timeObj = {
            hour: 12,
            minute: 10,
            second: 15
        };

        expect(Time.createFrom(timeObj).hour).to.equal(timeObj.hour);
        expect(Time.createFrom(timeObj).minute).to.equal(timeObj.minute);
        expect(Time.createFrom(timeObj).second).to.equal(timeObj.second);
    }

    @test 'should throw exceptions from createFromj'() {
        expect(() => Time.createFrom({
        })).to.throw(Error, 'Property hour, minute, second fehlt');

        expect(() => Time.createFrom({
            hour: 12
        })).to.throw(Error, 'Property minute, second fehlt.');

        expect(() => Time.createFrom({
            hour: 12,
            minute: 15
        })).to.throw(Error, 'Property second fehlt');
    }




    @test 'should throw an exception for 60 minutes '() {
        return expect(() => new Time(8, 60, 0)).to.throw(Error);
    }

    @test 'should throw an exception for -1 minutes'() {
        return expect(() => new Time(8, -1, 0)).to.throw(Error);
    }

    @test 'should throw an exception for 60 seconds '() {
        return expect(() => new Time(8, 0, 60)).to.throw(Error);
    }

    @test 'should throw an exception for -1 seconds'() {
        return expect(() => new Time(8, 0, -1)).to.throw(Error);
    }

}


function timeToSecond(time: Time): number {
    return time.hour * 3600 + time.minute * 60 + time.second;
}


@suite('Time (add, subtract)')
class TimeOperationsTest {

    @test 'should get seconds from hour'() {
        let time = new Time(8, 0, 0);
        return expect(time.toSeconds()).to.equal(timeToSecond(time));
    }

    @test 'should get seconds from minute'() {
        let time = new Time(0, 10, 0);
        return expect(time.toSeconds()).to.equal(timeToSecond(time));
    }

    @test 'should get seconds from second'() {
        let time = new Time(0, 0, 11);
        return expect(time.toSeconds()).to.equal(timeToSecond(time));
    }

    @test 'should get time from seconds'() {
        let time = new Time(12, 15, 10);
        return expect(Time.createFromSeconds(time.toSeconds())).to.deep.equal(time);
    }

    @test 'should get time from seconds -> Exception'() {
        let time = new Time(23, 59, 59);
        return expect(() => Time.createFromSeconds(time.toSeconds() + 1)).to.throw(Error);
    }

    @test 'should add times'() {
        let time1 = new Time(12, 0, 0);
        let time2 = new Time(1, 30, 0);
        let result = time1.add(time2);
        let expected = new Time(13, 30, 0);

        return expect(result).to.deep.equal(expected);
    }

    @test 'should subtract times'() {
        let time1 = new Time(12, 0, 0);
        let time2 = new Time(1, 30, 0);
        let result = time1.subtract(time2);
        let expected = new Time(10, 30, 0);

        return expect(result).to.deep.equal(expected);
    }


    @test 'should add times -> Exception'() {
        let time1 = new Time(23, 59, 59);
        let time2 = new Time(1, 30, 0);
        return expect(() => time1.add(time2)).to.throw(Error);
    }

     @test 'should subtract times -> Exception'() {
        let time1 = new Time(0, 0, 0);
        let time2 = new Time(1, 30, 0);
        return expect(() => time1.subtract(time2)).to.throw(Error);
    }

}