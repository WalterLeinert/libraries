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
import { User } from '../../../../src/model/user';
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