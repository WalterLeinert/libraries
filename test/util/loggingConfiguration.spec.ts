import path = require('path');
import process = require('process');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { LoggingConfiguration, LoggingConfigurationOptions } from '../../src/util';

class Test {
    constructor(public name: string, public id: number) {
    }
}

class Test2 {
    constructor() {
    }
}

@suite('LoggingConfiguration')
class LoggingConfigurationTest {


    @test 'should get path w/o systemMode'() {
        let expectedPath = path.join(
            process.cwd(),
            LoggingConfiguration.DEFAULT_RELATIVE_PATH,
            LoggingConfiguration.DEFAULT_FILENAME + LoggingConfiguration.DEFAULT_EXTENSION
        );
        return expect(LoggingConfiguration.getConfigurationPath()).to.be.eql(expectedPath);
    }

    @test 'should get path with systemMode'() {
        let systemMode = 'development';
        let expectedPath = path.join(
            process.cwd(),
            LoggingConfiguration.DEFAULT_RELATIVE_PATH,
            LoggingConfiguration.DEFAULT_FILENAME + '.' + systemMode + LoggingConfiguration.DEFAULT_EXTENSION
        );
        return expect(LoggingConfiguration.getConfigurationPath(systemMode)).to.be.eql(expectedPath);
    }

    @test 'should get path with options (filename)'() {
        let options: LoggingConfigurationOptions = {
            filename: 'logging'
        };
        let expectedPath = this.buildPath(options);

        return expect(LoggingConfiguration.getConfigurationPath(options)).to.be.eql(expectedPath);
    }

    @test 'should get path with options (relativePath)'() {
        let options: LoggingConfigurationOptions = {
            relativePath: 'lib/config'
        };
        let expectedPath = this.buildPath(options);

        return expect(LoggingConfiguration.getConfigurationPath(options)).to.be.eql(expectedPath);
    }

    private buildPath(options: LoggingConfigurationOptions): string {
        return path.join(
            process.cwd(),
            options.relativePath ? options.relativePath : LoggingConfiguration.DEFAULT_RELATIVE_PATH,
            options.filename + LoggingConfiguration.DEFAULT_EXTENSION
        );
    }

}