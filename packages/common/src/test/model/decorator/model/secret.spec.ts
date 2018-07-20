// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { Column } from '../../../../lib/model/decorator/column';
import { IdColumn } from '../../../../lib/model/decorator/id-column';
import { Secret } from '../../../../lib/model/decorator/secret';
import { Table } from '../../../../lib/model/decorator/table';
import { MetadataStorage } from '../../../../lib/model/metadata/metadataStorage';
import { TableMetadata } from '../../../../lib/model/metadata/tableMetadata';
import { CommonTest } from '../../../common.spec';


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
  public passwordSalt: string;
}

class NoEntity {
  public password: string;
  public passwordSalt: string;
}


@suite('model.decorator.Secret')
class SecretTest extends CommonTest {
  private tableMetadata: TableMetadata;

  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist columnMetadata'() {
    expect(this.tableMetadata.getSecretColumn('password')).to.be.not.null;
    expect(this.tableMetadata.getSecretColumn('passwordSalt')).to.be.not.null;
  }

  @test 'should have secrets reset'() {
    const artikel = new ArtikelSecret();
    artikel.password = 'password';
    artikel.passwordSalt = 'passwordSalt';

    MetadataStorage.instance.resetSecrets(artikel);

    expect(artikel.password).to.be.undefined;
    expect(artikel.passwordSalt).to.be.undefined;
  }

  @test 'should log warning for unregistered class'() {
    const artikel = new NoEntity();
    artikel.password = 'password';
    artikel.passwordSalt = 'passwordSalt';

    MetadataStorage.instance.resetSecrets(artikel);
  }


  protected before(done?: (err?: any) => void) {
    super.before(() => {
      this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelSecret);
      done();
    });
  }


}