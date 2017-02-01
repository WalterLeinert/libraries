require('reflect-metadata');

import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { IUser } from '../../src/model';
import { AssertionError } from '../../src/util';

import { Types } from '../../src/types';



/**
 * Hilfsklasse für dne Test aus existierende Methode
 * 
 * @class TestUser
 * @implements {IUser}
 */
class TestUser implements IUser {
    constructor(public id: number, public username, public firstname, public lastname, public role: number,
        public password: string, public password_salt: string) {
    }


    public resetCredentials() {
    }

    public get isAdmin(): boolean {
        return false;
    }
}



@suite('Types')
class TypesTest {

    @test 'should test various types'() {
        expect(Types.isArray([1, 2])).to.be.true;
        expect(Types.isFunction(function () { })).to.be.true;
        expect(Types.isBoolean(true)).to.be.true;
        expect(Types.isNumber(4711)).to.be.true;
        expect(Types.isObject({ name: 'hugo' })).to.be.true;
        expect(Types.isString('hugo')).to.be.true;
        expect(Types.isSymbol(Symbol('hugo'))).to.be.true;

        expect(Types.isNull(null)).to.be.true;
        expect(Types.isUndefined(undefined)).to.be.true;
    }

    @test 'should test functions/properties'() {
        let user = new TestUser(1, 'walter', 'walter', 'leinert', 1, '', '');
        expect(Types.hasMethod(user, 'noSuchFunction')).to.be.false;
        expect(Types.hasMethod(user, 'resetCredentials')).to.be.true;

        expect(Types.hasProperty(user, 'password')).to.be.true;
        expect(Types.hasProperty(user, 'noSuchpassword')).to.be.false;
    }

}