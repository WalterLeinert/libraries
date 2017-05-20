// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionException } from '@fluxgate/core';

import { Column, IdColumn, MetadataStorage, Table, TableServiceRequests } from '../../../../src/model';
import { TableMetadataInternal } from '../../../../src/model/metadata/tableMetadataInternal';


class NoValidEntity {
}

@Table({ name: ArtikelTableServiceRequests.TABLE_NAME })
class ArtikelTableServiceRequests {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;
}

// dummy service
@TableServiceRequests(ArtikelTableServiceRequests)
class ArtikelServiceRequests {
}


const noValidEntityTester = () => {
  @TableServiceRequests(NoValidEntity)
  class ArtikelService {
  }
};

const nullEntityTester = () => {
  @TableServiceRequests(null)
  class ArtikelService {
  }
};


@suite('model.decorator.TableServiceRequests')
class TableServiceRequestsTest {
  private tableMetadata: TableMetadataInternal;

  @test 'should exist tableMetadata'() {
    expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should have table service'() {
    expect(this.tableMetadata.serviceRequestsClazz).to.equal(ArtikelServiceRequests);
  }

  @test 'should test invalid entity table'() {
    return expect(() => noValidEntityTester()).to.Throw(AssertionException);
  }

  @test 'should test entity table null'() {
    return expect(() => nullEntityTester()).to.Throw(AssertionException);
  }

  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(
      ArtikelTableServiceRequests) as TableMetadataInternal;
  }

}