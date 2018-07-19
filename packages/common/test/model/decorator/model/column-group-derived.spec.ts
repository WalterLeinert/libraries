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



@ColumnGroup('base', [
  'id'
], { displayName: 'Base' })
@ColumnGroup('name', [
  'name'
], { displayName: 'Name' })
@Table()
class BaseColumnGroup implements IEntity<number> {
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
@Table({ name: DerivedColumnGroup.TABLE_NAME })
class DerivedColumnGroup extends BaseColumnGroup {
  public static readonly TABLE_NAME = 'test2';

  @Column({ name: 'artikel_weight' })
  public weight: number;

  @Column({ name: 'artikel_length' })
  public length: number;
}



@suite('model.decorator.ColumnGroup - derived:')
class ColumnGroupTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist 3 columnGroups'() {
    return expect(this.tableMetadata.columnGroupMetadata.length).to.equal(3);
  }

  @test 'should verify columnGroup base'() {
    expect(this.tableMetadata.columnGroupMetadata[0].name).to.equal('base');
  }

  @test 'should verify columnGroup name'() {
    expect(this.tableMetadata.columnGroupMetadata[1].name).to.equal('name');
  }

  @test 'should verify columnGroup extended'() {
    expect(this.tableMetadata.columnGroupMetadata[2].name).to.equal('extended');
  }


  @test 'should verify columns of group base'() {
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
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(DerivedColumnGroup);
      done();
    });
  }

}