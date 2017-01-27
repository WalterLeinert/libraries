require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionError } from '../../src/util';

import { ShortTime } from '../../src/types/shortTime';

let expedtedTimes = [
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
class TimeShortTest {

    @test 'should create instance of class ShortTime'() {
        return expect(new ShortTime(8, 0)).to.be.not.null;
    }

    @test 'should format times'() {
        expedtedTimes.forEach(test => {
            expect(test.time.toString()).to.equal(test.text);
        });
    }

    @test 'should parse times'() {
        expedtedTimes.forEach(test => {
            expect(ShortTime.parse(test.text)).to.deep.equal(test.time);
        });
    }

    @test 'should createFrom obj'() {
        let timeObj = {
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




    @test 'should throw an exception for 60 minutes '() {
        return expect(() => new ShortTime(8, 60)).to.throw(Error);
    }

    @test 'should throw an exception for -1 minutes'() {
        return expect(() => new ShortTime(8, -1)).to.throw(Error);
    }

}