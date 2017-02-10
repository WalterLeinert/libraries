// tslint:disable:member-access
// tslint:disable:max-classes-per-file

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { using } from '../../src/base/disposable';
import { getLogger, levels, Logger, XLog } from '../../src/diagnostics';


class Test {
    protected static readonly logger = getLogger('Test');

    constructor(name: string) {
        using(new XLog(Test.logger, levels.INFO, 'ctor'), (log) => {
            // ok
        });
    }
}

class Test2 {
    protected static readonly logger = getLogger(Test2);

    constructor(name: string) {
        using(new XLog(Test2.logger, levels.INFO, 'ctor'), (log) => {
            // ok
        });
    }
}


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