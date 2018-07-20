// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { ColumnTypes, MetadataStorage, Table, TableMetadata } from '../../../../lib/model';
import { ArtikelDerived } from './table-derived.spec';


@Table({ name: ArtikelDerivedDerived2.TABLE_NAME })
class ArtikelDerivedDerived2 extends ArtikelDerived {
  public static readonly TABLE_NAME: string = 'artikelderived';

}


@suite('model.decorator.Table: derived (only new table name)')
class TableDerived2Test {
  private derivedTableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    expect(MetadataStorage.instance.findTableMetadata(ArtikelDerived)).to.be.not.null;
    expect(MetadataStorage.instance.findTableMetadata(ArtikelDerivedDerived2)).to.be.not.null;
  }

  @test 'should have table options'() {
    expect(this.derivedTableMetadata.options.name).to.equal(ArtikelDerivedDerived2.TABLE_NAME);
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


  @test 'should exist columnMetadata for name (from base class)'() {
    const propertyName = 'name';
    const colMetaData = this.derivedTableMetadata.getColumnMetadataByProperty(propertyName);
    expect(colMetaData).to.be.not.null;
    expect(colMetaData.propertyName).to.equal(propertyName);
    expect(colMetaData.propertyType).to.equal(ColumnTypes.STRING);
    expect(colMetaData.options.name).to.equal('artikel_name');
    expect(colMetaData.options.displayName).to.equal('Name');
    expect(colMetaData.options.primary).to.be.undefined;
    expect(colMetaData.options.generated).to.be.undefined;
  }


  protected before() {
    this.derivedTableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelDerivedDerived2);
  }

}