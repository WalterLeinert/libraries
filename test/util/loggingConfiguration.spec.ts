// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import path = require('path');
import process = require('process');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ILoggingConfigurationOptions, LoggingConfiguration } from '../../src/util';

class Test {
    constructor(public name: string, public id: number) {
    }
}

class Test2 {
    constructor() {
        // ok
    }
}

@suite('LoggingConfiguration')
class LoggingConfigurationTest {


    @test 'should get path w/o systemMode'() {
        const expectedPath = path.join(
            process.cwd(),
            LoggingConfiguration.DEFAULT_RELATIVE_PATH,
            LoggingConfiguration.DEFAULT_FILENAME + LoggingConfiguration.DEFAULT_EXTENSION
        );
        return expect(LoggingConfiguration.getConfigurationPath()).to.be.eql(expectedPath);
    }

    @test 'should get path with systemMode'() {
        const systemMode = 'development';
        const expectedPath = path.join(
            process.cwd(),
            LoggingConfiguration.DEFAULT_RELATIVE_PATH,
            LoggingConfiguration.DEFAULT_FILENAME + '.' + systemMode + LoggingConfiguration.DEFAULT_EXTENSION
        );
        return expect(LoggingConfiguration.getConfigurationPath(systemMode)).to.be.eql(expectedPath);
    }

    @test 'should get path with options (filename)'() {
        const options: ILoggingConfigurationOptions = {
            filename: 'logging'
        };
        const expectedPath = this.buildPath(options);

        return expect(LoggingConfiguration.getConfigurationPath(options)).to.be.eql(expectedPath);
    }

    @test 'should get path with options (relativePath)'() {
        const options: ILoggingConfigurationOptions = {
            relativePath: 'lib/config'
        };
        const expectedPath = this.buildPath(options);

        return expect(LoggingConfiguration.getConfigurationPath(options)).to.be.eql(expectedPath);
    }

    private buildPath(options: ILoggingConfigurationOptions): string {
        return path.join(
            process.cwd(),
            options.relativePath ? options.relativePath : LoggingConfiguration.DEFAULT_RELATIVE_PATH,
            (options.filename ? options.filename : LoggingConfiguration.DEFAULT_FILENAME) +
            LoggingConfiguration.DEFAULT_EXTENSION
        );
    }

}