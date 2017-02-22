// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');


import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Types } from '../../../../src/types';
import { AssertionError } from '../../../../src/util';

import { Column, ColumnTypes, Enum, EnumTable, MetadataStorage, Table, TableMetadata } from '../../../../src/model';


@Table({ name: ArtikelEnumTable.TABLE_NAME })
class ArtikelEnumTable {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;


  @Enum<KollektionEnumTable, string, number>((dataSource) => KollektionEnumTable,
    (kollektion) => kollektion.nameKoll, (kollektion) => kollektion.idKoll)
  @Column({ name: 'id_kollektion', nullable: true })
  public id_kollektion?: number;
}



@EnumTable({
  enumValues: KollektionEnumTable.ENUM_VALUES
})
class KollektionEnumTable {
  public static ENUM_VALUES: KollektionEnumTable[] = [
    new KollektionEnumTable(1, 'Winter'),
    new KollektionEnumTable(2, 'Summer')
  ];


  public constructor(id: number, name: string) {
    this.idKoll = id;
    this.nameKoll = name;
  }

  @Column({ name: 'kollektion_id', primary: true, generated: true })
  public idKoll: number = 1;

  @Column({ name: 'kollektion_name' })
  public nameKoll: string = 'summer';
}




@suite('model.decorator.EnumTable')
class EnumTableTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist columnMetadata'() {
    expect(this.tableMetadata.columnMetadata).to.be.not.null;
    expect(this.tableMetadata.columnMetadata.length).to.equal(3);
  }

  @test 'should exist dataSource'() {
    const propertyName = 'id_kollektion';
    const colMetaData = this.tableMetadata.getColumnMetadataByProperty(propertyName);
    expect(colMetaData).to.be.not.null;
    expect(colMetaData.propertyName).to.equal(propertyName);
    expect(colMetaData.propertyType).to.equal(ColumnTypes.NUMBER);

    expect(colMetaData.enumMetadata).to.be.not.null;
    expect(colMetaData.enumMetadata.dataSource).to.be.not.null;
    expect(colMetaData.enumMetadata.dataSource).to.equal(KollektionEnumTable);
  }

  @test 'should exist text/ValueField'() {
    const propertyName = 'id_kollektion';
    const colMetaData = this.tableMetadata.getColumnMetadataByProperty(propertyName);


    const koll = new KollektionEnumTable(4711, 'Spring');

    expect(colMetaData.enumMetadata.foreignText(koll)).to.be.equal(koll.nameKoll);
    expect(colMetaData.enumMetadata.foreignId(koll)).to.be.equal(koll.idKoll);

    expect(colMetaData.enumMetadata.textField).to.be.equal('nameKoll');
    expect(colMetaData.enumMetadata.valueField).to.be.equal('idKoll');
  }

  @test 'should test enumValues'() {
    const tableMetadata = MetadataStorage.instance.findTableMetadata(KollektionEnumTable);
    const serviceInstace = tableMetadata.getServiceInstance(undefined);
    expect(serviceInstace).to.be.not.null;
    expect(Types.hasMethod(serviceInstace, 'find')).to.be.true;

    serviceInstace.find().subscribe((items) => {
      expect(items).to.deep.equal(KollektionEnumTable.ENUM_VALUES);
    });
  }


  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelEnumTable);
  }

}