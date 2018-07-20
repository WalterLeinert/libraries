// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Column } from '../../../../lib/model/decorator/column';
import { Enum } from '../../../../lib/model/decorator/enum';
import { IdColumn } from '../../../../lib/model/decorator/id-column';
import { Table } from '../../../../lib/model/decorator/table';
import { ColumnTypes } from '../../../../lib/model/metadata/columnTypes';
import { MetadataStorage } from '../../../../lib/model/metadata/metadataStorage';
import { TableMetadata } from '../../../../lib/model/metadata/tableMetadata';
import { CommonTest } from '../../../common.spec';


@Table({ name: ArtikelEnum.TABLE_NAME })
class ArtikelEnum {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;


  @Enum<KollektionEnum, string, number>((dataSource) => KollektionEnum,
    (kollektion) => kollektion.nameKoll, (kollektion) => kollektion.idKoll)
  @Column({ name: 'id_kollektion', nullable: true })
  public idKollektion?: number;
}


@Table({ name: 'kollektion' })
class KollektionEnum {

  @IdColumn({ name: 'kollektion_id' })
  public idKoll: number = 1;

  @Column({ name: 'kollektion_name' })
  public nameKoll: string = 'summer';
}




@suite('model.decorator.Enum')
class EnumTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist columnMetadata'() {
    expect(this.tableMetadata.columnMetadata).to.be.not.null;
    expect(this.tableMetadata.columnMetadata.length).to.equal(3);
  }

  @test 'should exist dataSource'() {
    const propertyName = 'idKollektion';
    const colMetaData = this.tableMetadata.getColumnMetadataByProperty(propertyName);
    expect(colMetaData).to.be.not.null;
    expect(colMetaData.propertyName).to.equal(propertyName);
    expect(colMetaData.propertyType).to.equal(ColumnTypes.NUMBER);

    expect(colMetaData.enumMetadata).to.be.not.null;
    expect(colMetaData.enumMetadata.dataSource).to.be.not.null;
    expect(colMetaData.enumMetadata.dataSource).to.equal(KollektionEnum);
  }

  @test 'should exist text/ValueField'() {
    const propertyName = 'idKollektion';
    const colMetaData = this.tableMetadata.getColumnMetadataByProperty(propertyName);


    const koll = new KollektionEnum();

    expect(colMetaData.enumMetadata.foreignText(koll)).to.be.equal(koll.nameKoll);
    expect(colMetaData.enumMetadata.foreignId(koll)).to.be.equal(koll.idKoll);

    expect(colMetaData.enumMetadata.textField).to.be.equal('nameKoll');
    expect(colMetaData.enumMetadata.valueField).to.be.equal('idKoll');
  }


  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelEnum);
      done();
    });
  }

}