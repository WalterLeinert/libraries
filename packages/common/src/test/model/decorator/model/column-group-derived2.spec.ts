// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Column } from '../../../../lib/model/decorator/column';
import { ColumnGroup } from '../../../../lib/model/decorator/column-group';
import { IdColumn } from '../../../../lib/model/decorator/id-column';
import { Table } from '../../../../lib/model/decorator/table';
import { IEntity } from '../../../../lib/model/entity.interface';
import { ColumnGroupMetadata } from '../../../../lib/model/metadata/column-group-metadata';
import { MetadataStorage } from '../../../../lib/model/metadata/metadataStorage';
import { TableMetadata } from '../../../../lib/model/metadata/tableMetadata';
import { CommonTest } from '../../../common.spec';



@ColumnGroup('base', [
  'name'
], { displayName: 'Name' })
@Table()
class BaseColumnGroup2 implements IEntity<number> {
  @IdColumn()
  public id: number;

  @Column()
  public name: string;
}



@ColumnGroup('name', [
  'name'
], { displayName: 'Name-derived' })
@ColumnGroup('extended', [
  'weight',
  'length'
], { displayName: 'Ext' })
@Table({ name: DerivedColumnGroup2.TABLE_NAME })
class DerivedColumnGroup2 extends BaseColumnGroup2 {
  public static readonly TABLE_NAME = 'test2';

  @Column({ name: 'artikel_weight' })
  public weight: number;

  @Column({ name: 'artikel_length' })
  public length: number;
}



@suite('model.decorator.ColumnGroup - derived2:')
class ColumnGroupTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist 3 columnGroups (column "base.name" reassigned to "name.name" -> column group "base" removed)'() {
    return expect(this.tableMetadata.columnGroupMetadata.length).to.equal(3);
  }



  @test 'should verify columnGroup default'() {
    expect(this.tableMetadata.columnGroupMetadata[0].name).to.equal(ColumnGroupMetadata.DEFAULT_NAME);
  }

  @test 'should verify columnGroup name'() {
    expect(this.tableMetadata.columnGroupMetadata[1].name).to.equal('name');
  }

  @test 'should verify columnGroup extended'() {
    expect(this.tableMetadata.columnGroupMetadata[2].name).to.equal('extended');
  }


  @test 'should verify columns of group default'() {
    expect(this.tableMetadata.columnGroupMetadata[0].groupColumns.length).to.equal(1);
    expect(this.tableMetadata.columnGroupMetadata[0].groupColumns[0].propertyName).to.equal('id');
  }


  @test 'should verify columns of group name (derived)'() {
    expect(this.tableMetadata.columnGroupMetadata[1].groupColumns.length).to.equal(1);
    expect(this.tableMetadata.columnGroupMetadata[1].groupColumns[0].propertyName).to.equal('name');
    expect(this.tableMetadata.columnGroupMetadata[1].options.displayName).to.equal('Name-derived');
  }


  @test 'should verify columns of group extended'() {
    expect(this.tableMetadata.columnGroupMetadata[2].groupColumns.length).to.equal(2);
    expect(this.tableMetadata.columnGroupMetadata[2].groupColumns[0].propertyName).to.equal('weight');
    expect(this.tableMetadata.columnGroupMetadata[2].groupColumns[1].propertyName).to.equal('length');
  }



  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(DerivedColumnGroup2);
      done();
    });
  }

}