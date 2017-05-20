// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import {
  ClientColumn, Column, ColumnTypes, IdColumn, IEntity, MetadataStorage, Table, TableMetadata
} from '../../../../src/model';


@Table({ name: ArtikelClient.TABLE_NAME })
class ArtikelClient implements IEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;

  @ClientColumn({ name: 'id_client' })
  public id_client?: number;
}



@suite('model.decorator.Client')
class ColumnTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist clientMetadata'() {
    const clientMetadata = this.tableMetadata.clientColumn;
    expect(clientMetadata).to.be.not.null;

    expect(clientMetadata.propertyName).to.equal('id_client');
    expect(clientMetadata.propertyType).to.equal(ColumnTypes.NUMBER);
  }


  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelClient);
  }

}