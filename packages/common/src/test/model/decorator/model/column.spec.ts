// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Column } from '../../../../lib/model/decorator/column';
import { IdColumn } from '../../../../lib/model/decorator/id-column';
import { Table } from '../../../../lib/model/decorator/table';
import { ColumnTypes } from '../../../../lib/model/metadata/columnTypes';
import { MetadataStorage } from '../../../../lib/model/metadata/metadataStorage';
import { TableMetadata } from '../../../../lib/model/metadata/tableMetadata';
import { CommonTest } from '../../../common.spec';


@Table({ name: Artikel.TABLE_NAME })
class Artikel {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;
}


@suite('model.decorator.Column')
class ColumnTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist columnMetadata'() {
    expect(this.tableMetadata.columnMetadata).to.be.not.null;
    expect(this.tableMetadata.columnMetadata.length).to.equal(2);
  }

  @test 'should exist columnMetadata for id'() {
    const propertyName = 'id';
    const colMetaData = this.tableMetadata.getColumnMetadataByProperty(propertyName);
    expect(colMetaData).to.be.not.null;
    expect(colMetaData.propertyName).to.equal(propertyName);
    expect(colMetaData.propertyType).to.equal(ColumnTypes.NUMBER);
    expect(colMetaData.options.name).to.equal('artikel_id');
    expect(colMetaData.options.primary).to.be.true;
    expect(colMetaData.options.generated).to.be.true;
  }

  @test 'should exist columnMetadata for name'() {
    const propertyName = 'name';
    const colMetaData = this.tableMetadata.getColumnMetadataByProperty(propertyName);
    expect(colMetaData).to.be.not.null;
    expect(colMetaData.propertyName).to.equal(propertyName);
    expect(colMetaData.propertyType).to.equal(ColumnTypes.STRING);
    expect(colMetaData.options.name).to.equal('artikel_name');
    expect(colMetaData.options.displayName).to.equal('Name');
  }


  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(Artikel);
      done();
    });
  }

}