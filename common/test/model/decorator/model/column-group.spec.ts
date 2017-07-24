// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Column } from '../../../../src/model/decorator/column';
import { ColumnGroup } from '../../../../src/model/decorator/column-group';
import { IdColumn } from '../../../../src/model/decorator/id-column';
import { Table } from '../../../../src/model/decorator/table';
import { IEntity } from '../../../../src/model/entity.interface';
import { MetadataStorage } from '../../../../src/model/metadata/metadataStorage';
import { TableMetadata } from '../../../../src/model/metadata/tableMetadata';
import { CommonTest } from '../../../common.spec';


// @ColumnGroup2<ArtikelColumnGroup>('standard', [
//   (t) => t.id,
//   (t) => t.name
// ])
// @ColumnGroup2<ArtikelColumnGroup>('extended', [
//   (t) => t.weight,
//   (t) => t.length
// ])
@ColumnGroup('standard', [
  'id',
  'name'
], { displayName: 'Standard' })
@ColumnGroup('extended', [
  'weight',
  'length'
], { displayName: 'Ext' })
@Table({ name: ArtikelColumnGroup.TABLE_NAME })
class ArtikelColumnGroup implements IEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'artikel_name' })
  public name: string;

  @Column({ name: 'artikel_weight' })
  public weight: number;

  @Column({ name: 'artikel_length' })
  public length: number;
}



@suite('model.decorator.ColumnGroup')
class ColumnGroupTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist 2 columnGroups'() {
    return expect(this.tableMetadata.columnGroupMetadata.length).to.equal(2);
  }

  @test 'should verify columnGroup standard'() {
    expect(this.tableMetadata.columnGroupMetadata[0].name).to.equal('standard');
  }

  @test 'should verify columnGroups extended'() {
    expect(this.tableMetadata.columnGroupMetadata[1].name).to.equal('extended');
  }

  @test 'should verify columns of group standard'() {
    expect(this.tableMetadata.columnGroupMetadata[0].groupColumns.length).to.equal(2);
    expect(this.tableMetadata.columnGroupMetadata[0].groupColumns[0].propertyName).to.equal('id');
    expect(this.tableMetadata.columnGroupMetadata[0].groupColumns[1].propertyName).to.equal('name');
  }


  @test 'should verify columns of group extended'() {
    expect(this.tableMetadata.columnGroupMetadata[1].groupColumns.length).to.equal(2);
    expect(this.tableMetadata.columnGroupMetadata[1].groupColumns[0].propertyName).to.equal('weight');
    expect(this.tableMetadata.columnGroupMetadata[1].groupColumns[1].propertyName).to.equal('length');
  }



  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelColumnGroup);
      done();
    });
  }

}