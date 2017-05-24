// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Column, FlxEntity, IdColumn, MetadataStorage, Table, TableMetadata } from '../../../../src/model';


@Table({ name: FlxEntityClass.TABLE_NAME })
class FlxEntityClass extends FlxEntity<number> {
  public static readonly TABLE_NAME: string = 'flxEntityTest';

  @IdColumn({ name: 'flxEntityTest_id' })
  public id: number;

  @Column({ name: 'flxEntityTest_name', displayName: 'Name-Derived' })
  public name: string;
}


@suite('model.decorator.Table: Entity derived from FlxEntity')
class FlxEntityTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    expect(MetadataStorage.instance.findTableMetadata(FlxEntity)).to.be.not.null;
    expect(MetadataStorage.instance.findTableMetadata(FlxEntityClass)).to.be.not.null;
  }

  @test 'should have primaryKeyColumn inherited'() {
    expect(this.tableMetadata.primaryKeyColumn).to.be.not.null;
    expect(this.tableMetadata.primaryKeyColumn.propertyName).to.equal('id');
  }

  @test 'should have versionColumn inherited'() {
    expect(this.tableMetadata.versionColumn).to.be.not.null;
  }

  @test 'should have clientColumn inherited'() {
    expect(this.tableMetadata.clientColumn).to.be.not.null;
  }

  @test 'should have right target for primaryKeyColumn'() {
    expect(this.tableMetadata.primaryKeyColumn.target).to.equal(FlxEntityClass);
  }

  @test 'should have right target for versionColumn'() {
    expect(this.tableMetadata.versionColumn.target).to.equal(FlxEntityClass);
  }

  @test 'should have right target for clientColumn'() {
    expect(this.tableMetadata.clientColumn.target).to.equal(FlxEntityClass);
  }

  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(FlxEntityClass);
  }

}