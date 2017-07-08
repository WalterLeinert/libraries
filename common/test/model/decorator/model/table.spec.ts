// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { InvalidOperationException } from '@fluxgate/core';

import { Column, MetadataStorage, Table, TableMetadata } from '../../../../src/model';
import { CommonTest } from '../../../common.spec';


@Table({ name: ArtikelTable.TABLE_NAME })
class ArtikelTable {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;
}


const duplicateTableTester = () => {
  @Table({ name: ArtikelTable.TABLE_NAME })
  // tslint:disable-next-line:no-shadowed-variable
  class ArtikelTable {
    public static readonly TABLE_NAME = 'user';
  }
};


@suite('model.decorator.Table')
class TableTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should have table options'() {
    expect(this.tableMetadata.className).to.equal(ArtikelTable.name);
    expect(this.tableMetadata.options.name).to.equal(ArtikelTable.TABLE_NAME);
    expect(this.tableMetadata.options.isView).to.be.false;
  }

  @test 'should test duplicate table'() {
    return expect(() => duplicateTableTester()).to.Throw(InvalidOperationException);
  }


  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelTable);
      done();
    });
  }

}