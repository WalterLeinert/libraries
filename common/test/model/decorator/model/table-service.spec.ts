// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionException } from '@fluxgate/core';

import { Column, MetadataStorage, Table, TableService } from '../../../../src/model';
import { TableMetadataInternal } from '../../../../src/model/metadata/tableMetadataInternal';


class NoValidEntity {
}

@Table({ name: ArtikelTableService.TABLE_NAME })
class ArtikelTableService {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;
}

// dummy service
@TableService(ArtikelTableService)
class ArtikelService {
}


const noValidEntityTester = () => {
  @TableService(NoValidEntity)
  class ArtikelServiceNoValidEntity {
  }
};

const nullEntityTester = () => {
  @TableService(null)
  class ArtikelServiceNull {
  }
};


@suite('model.decorator.TableService')
class TableServiceTest {
  private tableMetadata: TableMetadataInternal;

  @test 'should exist tableMetadata'() {
    expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should have table service'() {
    expect(this.tableMetadata.serviceClazz).to.equal(ArtikelService);
  }

  @test 'should test invalid entity table'() {
    return expect(() => noValidEntityTester()).to.Throw(AssertionException);
  }

  @test 'should test entity table null'() {
    return expect(() => nullEntityTester()).to.Throw(AssertionException);
  }

  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelTableService) as TableMetadataInternal;
  }

}