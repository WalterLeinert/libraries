// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Column, IEntity, MetadataStorage, Table, TableMetadata, Test } from '../../../../lib/model';

interface ITestOptions {
  delayMilliSeconds: number;
}

class TestOptions implements ITestOptions {
  delayMilliSeconds: number;
}


@Table({ name: ArtikelTest.TABLE_NAME })
class ArtikelTest implements IEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;

  @Test()
  @Column({ name: 'artikel_test', persisted: false })
  // tslint:disable-next-line:variable-name
  public __test: any;
}



@suite('model.decorator.Test')
class ColumnTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist testMetadata'() {
    const testMetadata = this.tableMetadata.testColumn;
    expect(testMetadata).to.be.not.null;

    expect(testMetadata.propertyName).to.equal('__test');
  }

  @test 'should test option value'() {
    const testMetadata = this.tableMetadata.testColumn;

    const tester = new ArtikelTest();
    tester.__test = 4711;

    expect(tester[testMetadata.propertyName]).to.equal(tester.__test);
  }


  @test 'should test custom option'() {
    const testMetadata = this.tableMetadata.testColumn;

    const tester = new ArtikelTest();
    tester.__test = {
      delay: 12
    };

    expect(tester[testMetadata.propertyName]).to.deep.equal(tester.__test);
  }


  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelTest);
  }

}