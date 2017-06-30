// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Column, ColumnTypes, IdColumn, MetadataStorage, Secret, Table, TableMetadata } from '../../../../src/model';


@Table({ name: ArtikelSecret.TABLE_NAME })
class ArtikelSecret {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Secret()
  @Column()
  public password: string;

  @Secret()
  @Column()
  public password_salt: string;
}

class NoEntity {
  public password: string;
  public password_salt: string;
}


@suite('model.decorator.Secret')
class SecretTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist columnMetadata'() {
    expect(this.tableMetadata.getSecretColumn('password')).to.be.not.null;
    expect(this.tableMetadata.getSecretColumn('password_salt')).to.be.not.null;
  }

  @test 'should have secrets reset'() {
    const artikel = new ArtikelSecret();
    artikel.password = 'password';
    artikel.password_salt = 'password_salt';

    MetadataStorage.instance.resetSecrets(artikel);

    expect(artikel.password).to.be.undefined;
    expect(artikel.password_salt).to.be.undefined;
  }

  @test 'should log warning for unregistered class'() {
    const artikel = new NoEntity();
    artikel.password = 'password';
    artikel.password_salt = 'password_salt';

    MetadataStorage.instance.resetSecrets(artikel);
  }


  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelSecret);
  }

}