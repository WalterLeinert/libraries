// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Core } from '@fluxgate/core';


import { Column } from '../../src/model/decorator/column';
import { IdColumn } from '../../src/model/decorator/id-column';
import { Secret } from '../../src/model/decorator/secret';
import { Table } from '../../src/model/decorator/table';
import { MetadataStorage } from '../../src/model/metadata/metadataStorage';
import { TableMetadata } from '../../src/model/metadata/tableMetadata';
import { CommonTest } from '../common.spec';


@Table({ name: ArtikelEntityStrigifyer.TABLE_NAME })
class ArtikelEntityStrigifyer {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Secret()
  @Column()
  public password: string;

  @Secret()
  @Column()
  public password_salt: string;
}

class NoEntity {
  public password: string;
  public password_salt: string;
}


@suite('model.EntityStringifyer')
class EntityStringifyerTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }


  @test 'should have secrets reset'() {
    const entity = new ArtikelEntityStrigifyer();
    entity.password = 'password';
    entity.password_salt = 'password_salt';

    const entityStringifyed = Core.stringify(entity);
    expect(entityStringifyed).to.equal(`{"password":"*****","password_salt":"*****"}`);
  }

  @test 'should log warning for unregistered class'() {
    const entity = new NoEntity();
    entity.password = 'password';
    entity.password_salt = 'password_salt';

    const entityStringifyed = Core.stringify(entity);
    expect(entityStringifyed).to.equal(`{"password":"password","password_salt":"password_salt"}`);
  }

  @test 'should stringify null'() {
    const result = Core.stringify(null);
    expect(result).to.equal('null');
  }

  @test 'should stringify undefined'() {
    const result = Core.stringify(undefined);
    expect(result).to.equal(undefined);
  }


  @test 'should stringify number'() {
    const result = Core.stringify(4711);
    expect(result).to.equal('4711');
  }

  @test 'should stringify string'() {
    const result = Core.stringify('hugo');
    expect(result).to.equal('"hugo"');
  }

  @test 'should stringify Date'() {
    const result = Core.stringify(new Date(2006, 0, 2, 15, 4, 5));
    expect(result).to.equal('"2006-01-02T14:04:05.000Z"');
  }

  @test 'should stringify NoEntity'() {
    const result = Core.stringify(new NoEntity());
    expect(result).to.equal('{}');
  }

  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  @test 'should stringify test from MDN 1'() {
    const result = Core.stringify({ x: [10, undefined, () => { /*ok*/ }, Symbol('')] });
    expect(result).to.equal('{"x":[10,null,null,null]}');
  }

  @test 'should stringify test from MDN 2'() {
    // tslint:disable-next-line:only-arrow-functions
    const result = Core.stringify({ [Symbol('foo')]: 'foo' });
    expect(result).to.equal('{}');
  }


  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelEntityStrigifyer);
      done();
    });
  }
}