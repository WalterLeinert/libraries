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
import { FlxEntity } from '../../../../lib/model/flx-entity';
import { MetadataStorage } from '../../../../lib/model/metadata/metadataStorage';
import { TableMetadata } from '../../../../lib/model/metadata/tableMetadata';
import { CommonTest } from '../../../common.spec';


@Table({ name: FlxEntityClass.TABLE_NAME })
class FlxEntityClass extends FlxEntity<number> {
  public static readonly TABLE_NAME: string = 'flxEntityTest';

  @IdColumn({ name: 'flxEntityTest_id' })
  public id: number;

  @Column({ name: 'flxEntityTest_name', displayName: 'Name-Derived' })
  public name: string;
}


@suite('model.decorator.Table: Entity derived from FlxEntity')
class FlxEntityTest extends CommonTest {
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


  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(FlxEntityClass);
      done();
    });
  }

}