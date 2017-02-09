// tslint:disable:member-access

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { getLogger, levels, Logger } from '../../src/diagnostics';



@suite('Logger')
class LoggerTest {

    @test 'should create logger'() {
        const logger = getLogger('test');
        return expect(logger).to.be.not.null;
    }

    @test 'should set level DEBUG'() {
        const logger = getLogger('test');
        logger.setLevel(levels.DEBUG);
        return expect(logger.isDebugEnabled()).to.be.true;
    }

    @test 'should set level "DEBUG"'() {
        const logger = getLogger('test');
        logger.setLevel('DEBUG');
        return expect(logger.isDebugEnabled()).to.be.true;
    }

    @test 'should log DEBUG message'() {
        const logger = getLogger('test');
        logger.setLevel('DEBUG');
        return expect(() => logger.debug('debug message')).not.to.throw;
    }

    @test 'should set level WARN'() {
        const logger = getLogger('test');
        logger.setLevel(levels.WARN);
        expect(logger.isWarnEnabled()).to.be.true;
        expect(logger.isInfoEnabled()).to.be.false;
    }


}