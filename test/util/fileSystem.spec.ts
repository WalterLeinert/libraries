// tslint:disable:max-classes-per-file
// tslint:disable:member-access

import path = require('path');
import process = require('process');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { AssertionError } from '../../src/util';
import { FileSystem, LoggingConfiguration } from '../../src/util';



@suite('FilesSystem')
class LoggingConfigurationTest {

    @test 'should exist file'() {
        const testPath = path.join(process.cwd(), 'package.json');
        // console.log(testPath);
        return expect(FileSystem.fileExists(testPath)).to.be.true;
    }

    @test 'should not exist file'() {
        const testPath = path.join(process.cwd(), 'does-not-exist');
        // console.log(testPath);
        return expect(FileSystem.fileExists(testPath)).to.be.false;
    }

    @test 'should throw error for empty file path'() {
        return expect(() => FileSystem.fileExists('')).to.throw('subject is empty');
    }

    @test 'should throw error for null file path'() {
        return expect(() => FileSystem.fileExists(null)).to.throw(Error, 'value is null');
    }



    @test 'should exist directory'() {
        const testPath = path.join(process.cwd());
        // console.log(testPath);
        return expect(FileSystem.directoryExists(testPath)).to.be.true;
    }

    @test 'should not exist directory'() {
        const testPath = path.join(process.cwd(), 'does-not-exist');
        // console.log(testPath);
        return expect(FileSystem.directoryExists(testPath)).to.be.false;
    }

    @test 'should throw error for empty directory path'() {
        return expect(() => FileSystem.directoryExists('')).to.throw('subject is empty');
    }

    @test 'should throw error for null directory path'() {
        return expect(() => FileSystem.directoryExists(null)).to.throw(Error, 'value is null');
    }
}