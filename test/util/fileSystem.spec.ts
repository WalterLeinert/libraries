import path = require('path');
import process = require('process');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { FilesSystem, LoggingConfiguration } from '../../src/util';



@suite('FilesSystem')
class LoggingConfigurationTest {

    @test 'should exist file'() {
        let testPath = path.join(process.cwd(), 'package.json');
        // console.log(testPath);
        return expect(FilesSystem.fileExists(testPath)).to.be.true;
    }

    @test 'should not exist file'() {
        let testPath = path.join(process.cwd(), 'does-not-exist');
        // console.log(testPath);
        return expect(FilesSystem.fileExists(testPath)).to.be.false;
    }

    @test 'should exist directory'() {
        let testPath = path.join(process.cwd());
        // console.log(testPath);
        return expect(FilesSystem.directoryExists(testPath)).to.be.true;
    }

    @test 'should not exist directory'() {
        let testPath = path.join(process.cwd(), 'does-not-exist');
        // console.log(testPath);
        return expect(FilesSystem.directoryExists(testPath)).to.be.false;
    }
}