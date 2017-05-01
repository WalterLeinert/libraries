// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Column, ColumnTypes, MetadataStorage, Table, TableMetadata } from '../../../../src/model';
import { ArtikelDerived } from './table-derived.spec';


@Table({ name: ArtikelDerivedDerived3.TABLE_NAME })
class ArtikelDerivedDerived3 extends ArtikelDerived {
  public static readonly TABLE_NAME: string = 'artikelderived';

  @Column({ name: 'artikelderived_name', displayName: 'Name-Derived' })
  public name: string;
}


@suite('model.decorator.Table: derived (only overridden name column)')
class TableDerived2Test {
  private derivedTableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    expect(MetadataStorage.instance.findTableMetadata(ArtikelDerived)).to.be.not.null;
    expect(MetadataStorage.instance.findTableMetadata(ArtikelDerivedDerived3)).to.be.not.null;
  }

  @test 'should have table options'() {
    expect(this.derivedTableMetadata.options.name).to.equal(ArtikelDerivedDerived3.TABLE_NAME);
  }

  @test 'should exist columnMetadata for id (from base class)'() {
    const propertyName = 'id';
    const colMetaData = this.derivedTableMetadata.getColumnMetadataByProperty(propertyName);
    expect(colMetaData).to.be.not.null;
    expect(colMetaData.propertyName).to.equal(propertyName);
    expect(colMetaData.propertyType).to.equal(ColumnTypes.NUMBER);
    expect(colMetaData.options.name).to.equal('artikel_id');
    expect(colMetaData.options.primary).to.be.true;
    expect(colMetaData.options.generated).to.be.true;
  }


  @test 'should exist columnMetadata for name (overidden by derived class)'() {
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
    this.derivedTableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelDerivedDerived3);
  }

}