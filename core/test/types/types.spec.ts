// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Types } from '../../src/types';

// von @fluxgate/common kopiert
interface IUser {
  /**
   * Der Benutzername (login)
   */
  username: string;

  /**
   * die zugehörige Rolle
   */
  role: number;

  /**
   * Das Passwort (verschlüsselt)
   */
  password: string;

  /**
   * Das Passwort Salt (für Verschlüsselung)
   */
  password_salt: string;

  /**
   * Liefert true, falls der User ein Admin ist.
   *
   * @readonly
   * @type {boolean}
   * @memberOf User
   */
  isAdmin: boolean;

  /**
   * liefert true, falls die Entity als gelöscht markiert ist
   */
  deleted?: boolean;

  /**
   * Mandanten-Id
   */
  id_client?: number;

  /**
   * Setzt Passwort und Salt zurück
   *
   * @memberOf User
   */
  resetCredentials();
}


/**
 * Hilfsklasse für dne Test aus existierende Methode
 *
 * @class TestUser
 * @implements {IUser}
 */
class TestUser implements IUser {
  constructor(public id: number, public username, public firstname, public lastname, public role: number,
    public password: string, public password_salt: string, public id_client: number = 1, public __version: number = 1,
    public deleted: boolean = false) {
  }


  public resetCredentials() {
    // ok
  }

  public get isAdmin(): boolean {
    return false;
  }
}


class TestUserDerived extends TestUser {
}


@suite('core.types.Types')
class TypesTest {


  @test 'should test derived classes'() {
    expect(Types.hasConstructor(TestUser)).to.be.true;
    expect(Types.hasConstructor(TestUserDerived)).to.be.true;

    expect(Types.getBaseClass(TestUser)).to.be.undefined;
    expect(Types.getBaseClass(TestUserDerived)).not.be.undefined;

    expect(Types.getBaseClass(TestUserDerived)).to.be.equal(TestUser);
  }


  @test 'should test various types'() {
    expect(Types.isArray([1, 2])).to.be.true;
    expect(Types.isFunction(
      // tslint:disable-next-line:only-arrow-functions
      function() {
        // ok
      })).to.be.true;
    expect(Types.isBoolean(true)).to.be.true;
    expect(Types.isNumber(4711)).to.be.true;
    expect(Types.isObject({ name: 'hugo' })).to.be.true;
    expect(Types.isString('hugo')).to.be.true;
    expect(Types.isSymbol(Symbol('hugo'))).to.be.true;

    expect(Types.isNull(null)).to.be.true;
    expect(Types.isUndefined(undefined)).to.be.true;
  }

  @test 'should test primitives'() {
    expect(Types.isPrimitive(4711)).to.be.true;
    expect(Types.isPrimitive('Hallo')).to.be.true;
    expect(Types.isPrimitive(false)).to.be.true;
    expect(Types.isPrimitive(Symbol(999))).to.be.true;
    expect(Types.isPrimitive(undefined)).to.be.true;
  }

  @test 'should test functions/properties'() {
    const user = new TestUser(1, 'walter', 'walter', 'leinert', 1, '', '');
    expect(Types.hasMethod(user, 'noSuchFunction')).to.be.false;
    expect(Types.hasMethod(user, 'resetCredentials')).to.be.true;

    expect(Types.hasProperty(user, 'password')).to.be.true;
    expect(Types.hasProperty(user, 'noSuchpassword')).to.be.false;
  }

}