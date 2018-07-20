// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Core, JsonSerializer, OptimisticLockException } from '@fluxgate/core';


import { Column } from '../../lib/model/decorator/column';
import { IdColumn } from '../../lib/model/decorator/id-column';
import { Secret } from '../../lib/model/decorator/secret';
import { Table } from '../../lib/model/decorator/table';
import { MetadataStorage } from '../../lib/model/metadata/metadataStorage';
import { TableMetadata } from '../../lib/model/metadata/tableMetadata';
import { CommonTest } from '../common.spec';


@Table({ name: ArtikelEntityStringifyer.TABLE_NAME })
class ArtikelEntityStringifyer {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Secret()
  @Column()
  public password: string;

  @Secret()
  @Column()
  public passwordSalt: string;
}

class NoEntity {
  public password: string;
  public passwordSalt: string;
}


@suite('common.model.EntityStringifyer')
class EntityStringifyerTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }


  @test 'should have secrets reset'() {
    const entity = new ArtikelEntityStringifyer();
    entity.password = 'password';
    entity.passwordSalt = 'passwordSalt';

    const entityStringifyed = Core.stringify(entity);
    expect(entityStringifyed).to.equal(`{    // ArtikelEntityStringifyer
  "password": "*****",
  "passwordSalt": "*****"
}`);
  }

  @test 'should log warning for unregistered class'() {
    const entity = new NoEntity();
    entity.password = 'password';
    entity.passwordSalt = 'passwordSalt';

    const entityStringifyed = Core.stringify(entity);
    expect(entityStringifyed).to.equal(`{    // NoEntity
  "password": "password",
  "passwordSalt": "passwordSalt"
}`);
  }

  @test 'should stringify null'() {
    const result = Core.stringify(null);
    expect(result).to.equal('null');
  }

  @test 'should stringify undefined'() {
    const result = Core.stringify(undefined);
    expect(result).to.equal('undefined');
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
    const result = Core.stringify(new Date('2006-01-02T14:04:05.000Z'));
    expect(result).to.equal('"2006-01-02T14:04:05.000Z"');
  }

  @test 'should stringify NoEntity'() {
    const result = Core.stringify(new NoEntity());
    expect(result).to.equal(`{    // NoEntity
}`);
  }

  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  // Hinweis: die Ausgabe ist typtreuer als die originale JSON.stringify Ausgabe!
  @test 'should stringify test from MDN 1 (not fully compatible)'() {
    const result = Core.stringify({ x: [10, undefined, () => { /*ok*/ }, Symbol('my-symbol')] });
    expect(result).to.equal(`{    // Object
  "x": [
    10,
    undefined,
    (),
    Symbol(my-symbol)
  ]
}`);
  }

  @test 'should stringify test from MDN 2'() {
    // tslint:disable-next-line:only-arrow-functions
    const result = Core.stringify({ [Symbol('foo')]: 'foo' });
    expect(result).to.equal(`{    // Object
}`);
  }


  @test 'should serialize/deserialize exception'() {
    const formatter = new JsonSerializer();
    const value = new OptimisticLockException('test');

    const valueSerialized = formatter.serialize(value);
    const valueDeserialized = formatter.deserialize(valueSerialized);

    expect(value).to.eql(valueDeserialized);
  }


  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelEntityStringifyer);
      done();
    });
  }
}