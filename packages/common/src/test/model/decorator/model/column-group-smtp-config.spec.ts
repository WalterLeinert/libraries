// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { SmtpConfig } from '../../../../lib/config/smtp-config';
import { Column } from '../../../../lib/model/decorator/column';
import { ColumnGroup } from '../../../../lib/model/decorator/column-group';
import { IdColumn } from '../../../../lib/model/decorator/id-column';
import { Table } from '../../../../lib/model/decorator/table';
import { IEntity } from '../../../../lib/model/entity.interface';
import { MetadataStorage } from '../../../../lib/model/metadata/metadataStorage';
import { TableMetadata } from '../../../../lib/model/metadata/tableMetadata';
import { CommonTest } from '../../../common.spec';


@suite('model.decorator.ColumnGroup - SmtpConfig:')
class ColumnGroupTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist 2 columnGroups'() {
    expect(this.tableMetadata.columnGroupMetadata.length).to.equal(2);
  }

  @test 'should exist no hidden columnGroup'() {
    // tslint:disable-next-line:no-unused-expression
    expect(this.tableMetadata.columnGroupMetadata[0].hidden).to.be.false;
    // tslint:disable-next-line:no-unused-expression
    expect(this.tableMetadata.columnGroupMetadata[1].hidden).to.be.false;
  }


  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(SmtpConfig);
      done();
    });
  }

}