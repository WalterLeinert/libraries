// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import {
  ClientColumn, Column, ColumnTypes, EntityStatus, FlxStatusEntity,
  IdColumn, IEntity, MetadataStorage, Table, TableMetadata
} from '../../../../src/model';


@Table({ name: ArtikelStatusColumn.TABLE_NAME })
class ArtikelStatusColumn extends FlxStatusEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;
}


@suite('model.decorator.StatusColumn')
class StatusColumnTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }


  @test 'should exist status metadata'() {
    const statusMetadata = this.tableMetadata.getColumnMetadataByProperty('__status');
    // tslint:disable-next-line:no-unused-expression
    expect(statusMetadata).to.be.not.null;

    // tslint:disable-next-line:no-unused-expression
    expect(statusMetadata.options.hidden).to.be.true;
    // tslint:disable-next-line:no-unused-expression
    expect(statusMetadata.options.persisted).to.be.true;

    expect(statusMetadata.propertyName).to.equal('__status');
    expect(statusMetadata.propertyType).to.equal(ColumnTypes.NUMBER);
  }


  @test 'should exist archived metadata'() {
    const archivedMetadata = this.tableMetadata.getStatusColumn(EntityStatus.Archived);
    // tslint:disable-next-line:no-unused-expression
    expect(archivedMetadata).to.be.not.null;

    // tslint:disable-next-line:no-unused-expression
    expect(archivedMetadata.options.hidden).to.be.true;
    // tslint:disable-next-line:no-unused-expression
    expect(archivedMetadata.options.persisted).to.be.false;

    expect(archivedMetadata.propertyName).to.equal('__archived');
    expect(archivedMetadata.propertyType).to.equal(ColumnTypes.BOOLEAN);
  }


  @test 'should exist deleted metadata'() {
    const deletedMetadata = this.tableMetadata.getStatusColumn(EntityStatus.Deleted);
    // tslint:disable-next-line:no-unused-expression
    expect(deletedMetadata).to.be.not.null;

    // tslint:disable-next-line:no-unused-expression
    expect(deletedMetadata.options.hidden).to.be.true;
    // tslint:disable-next-line:no-unused-expression
    expect(deletedMetadata.options.persisted).to.be.false;

    expect(deletedMetadata.propertyName).to.equal('__deleted');
    expect(deletedMetadata.propertyType).to.equal(ColumnTypes.BOOLEAN);
  }

  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelStatusColumn);
  }

}