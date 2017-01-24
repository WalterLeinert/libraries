require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionError } from '../../src/util';

import { Time } from '../../src/types/time';

let expedtedTimes = [
    {
        time: new Time(0, 0, 0),
        text: '0:0:0'
    },
    {
        time: new Time(8, 30, 0),
        text: '8:30:0'
    },
    {
        time: new Time(18, 0, 15),
        text: '18:0:15'
    },
    {
        time: new Time(23, 59, 59),
        text: '23:59:59'
    }
];


@suite('Time')
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