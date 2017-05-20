// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Column, ColumnTypes, IdColumn, MetadataStorage, Table, TableMetadata } from '../../../../src/model';


@Table({ name: ArtikelDerived.TABLE_NAME })
export class ArtikelDerived {
  public static readonly TABLE_NAME: string = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;
}


@Table({ name: ArtikelDerivedDerived.TABLE_NAME })
class ArtikelDerivedDerived extends ArtikelDerived {
  public static readonly TABLE_NAME: string = 'artikelderived';

  @IdColumn({ name: 'artikelderived_id' })
  public id: number;

  @Column({ name: 'artikelderived_name', displayName: 'Name-Derived' })
  public name: string;
}


@suite('model.decorator.Table: derived')
class TableDerivedTest {
  private derivedTableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    expect(MetadataStorage.instance.findTableMetadata(ArtikelDerived)).to.be.not.null;
    expect(MetadataStorage.instance.findTableMetadata(ArtikelDerivedDerived)).to.be.not.null;
  }

  @test 'should have table options'() {
    expect(this.derivedTableMetadata.className).to.equal(ArtikelDerivedDerived.name);
    expect(this.derivedTableMetadata.options.name).to.equal(ArtikelDerivedDerived.TABLE_NAME);
    expect(this.derivedTableMetadata.options.isView).to.be.false;
  }

  @test 'should exist columnMetadata for id'() {
    const propertyName = 'id';
    const colMetaData = this.derivedTableMetadata.getColumnMetadataByProperty(propertyName);
    expect(colMetaData).to.be.not.null;
    expect(colMetaData.propertyName).to.equal(propertyName);
    expect(colMetaData.propertyType).to.equal(ColumnTypes.NUMBER);
    expect(colMetaData.options.name).to.equal('artikelderived_id');
    expect(colMetaData.options.primary).to.be.true;
    expect(colMetaData.options.generated).to.be.true;
  }


  @test 'should exist columnMetadata for name'() {
    const propertyName = 'name';
    const colMetaData = this.derivedTableMetadata.getColumnMetadataByProperty(propertyName);
    expect(colMetaData).to.be.not.null;
    expect(colMetaData.propertyName).to.equal(propertyName);
    expect(colMetaData.propertyType).to.equal(ColumnTypes.STRING);
    expect(colMetaData.options.name).to.equal('artikelderived_name');
    expect(colMetaData.options.displayName).to.equal('Name-Derived');
    expect(colMetaData.options.primary).to.be.undefined;
    expect(colMetaData.options.generated).to.be.undefined;
  }


  protected before() {
    this.derivedTableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelDerivedDerived);
  }

}