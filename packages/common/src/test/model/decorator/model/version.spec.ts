// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import {
  Column, ColumnTypes, MetadataStorage, Table, TableMetadata, VersionedEntity
} from '../../../../lib/model';


@Table({ name: ArtikelVersion.TABLE_NAME })
class ArtikelVersion extends VersionedEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;
}



@suite('model.decorator.Version')
class ColumnTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist versionMetadata'() {
    const versionMetadata = this.tableMetadata.versionColumn;
    // tslint:disable-next-line:no-unused-expression
    expect(versionMetadata).to.be.not.null;

    // tslint:disable-next-line:no-unused-expression
    expect(versionMetadata.options.hidden).to.be.true;

    expect(versionMetadata.propertyName).to.equal('__version');
    expect(versionMetadata.propertyType).to.equal(ColumnTypes.NUMBER);
  }


  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelVersion);
  }

}