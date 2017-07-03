// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { ClientColumn } from '../../../../src/model/decorator/client-column';
import { Column } from '../../../../src/model/decorator/column';
import { IdColumn } from '../../../../src/model/decorator/id-column';
import { Table } from '../../../../src/model/decorator/table';
import { IEntity } from '../../../../src/model/entity.interface';
import { ColumnTypes } from '../../../../src/model/metadata/columnTypes';
import { MetadataStorage } from '../../../../src/model/metadata/metadataStorage';
import { TableMetadata } from '../../../../src/model/metadata/tableMetadata';
import { CommonTest } from '../../../common.spec';


@Table({ name: ArtikelClient.TABLE_NAME })
class ArtikelClient implements IEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;

  @ClientColumn({ name: 'id_client' })
  public id_client?: number;
}

@Table({ name: ArtikelClient.TABLE_NAME })
class ArtikelClient2 implements IEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;

  @ClientColumn({ name: 'id_client', hidden: false })
  public id_client?: number;
}


@suite('model.decorator.Client')
class ColumnTest extends CommonTest {
  private tableMetadata: TableMetadata;
  private tableMetadata2: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist clientMetadata'() {
    const clientMetadata = this.tableMetadata.clientColumn;
    // tslint:disable-next-line:no-unused-expression
    expect(clientMetadata).to.be.not.null;

    // tslint:disable-next-line:no-unused-expression
    expect(clientMetadata.options.hidden).to.be.true;

    expect(clientMetadata.propertyName).to.equal('id_client');
    expect(clientMetadata.propertyType).to.equal(ColumnTypes.NUMBER);
  }

  @test 'should exist clientMetadata (hidden: false)'() {
    const clientMetadata = this.tableMetadata2.clientColumn;
    // tslint:disable-next-line:no-unused-expression
    expect(clientMetadata).to.be.not.null;

    // tslint:disable-next-line:no-unused-expression
    expect(clientMetadata.options.hidden).to.be.false;
  }



  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelClient);
      this.tableMetadata2 = MetadataStorage.instance.findTableMetadata(ArtikelClient2);
      done();
    });
  }

}