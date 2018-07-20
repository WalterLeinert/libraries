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



@Table()
class HiddenColumnGroup implements IEntity<number> {
  @IdColumn()
  public id: number;

  @Column()
  public name: string;
}


@suite('model.decorator.ColumnGroup - hidden:')
class ColumnGroupTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist 1 columnGroup'() {
    return expect(this.tableMetadata.columnGroupMetadata.length).to.equal(1);
  }

  @test 'should verify columnGroup hidden'() {
    // tslint:disable-next-line:no-unused-expression
    expect(this.tableMetadata.columnGroupMetadata[0].hidden).to.be.true;
  }

  @test 'should verify columnGroup name'() {
    expect(this.tableMetadata.columnGroupMetadata[0].name).to.equal(ColumnGroupMetadata.DEFAULT_NAME);
  }

  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(HiddenColumnGroup);
      done();
    });
  }

}