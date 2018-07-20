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
import { MetadataStorage } from '../../../../lib/model/metadata/metadataStorage';
import { TableMetadata } from '../../../../lib/model/metadata/tableMetadata';
import { User } from '../../../../lib/model/user';
import { CommonTest } from '../../../common.spec';


@suite('model.decorator.ColumnGroup - User:')
class ColumnGroupTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist 1 hidden columnGroup'() {
    expect(this.tableMetadata.columnGroupMetadata.length).to.equal(1);
    // tslint:disable-next-line:no-unused-expression
    expect(this.tableMetadata.columnGroupMetadata[0].hidden).to.be.true;
  }


  @test 'should verify columnGroup column names'() {
    expect(this.tableMetadata.columnGroupMetadata[0].columnNames.length).to.equal(
      this.tableMetadata.columnMetadata.length);
  }




  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(User);
      done();
    });
  }

}