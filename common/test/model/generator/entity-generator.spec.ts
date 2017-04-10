// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Client, Column, IFlxEntity, MetadataStorage, Table, TableMetadata, Version } from '../../../src/model';
import { ConstantValueGenerator } from '../../../src/model/generator/constant-value-generator';
import { EntityGenerator } from '../../../src/model/generator/entity-generator';
import { NumberIdGenerator } from '../../../src/model/generator/number-id-generator';


@Table({ name: ArtikelGenerator.TABLE_NAME })
class ArtikelGenerator implements IFlxEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'artikel_deleted' })
  public deleted?: boolean;

  @Client()
  @Column({ name: 'id_mandant' })
  public mandant?: number;

  @Version()
  @Column({ name: 'artikel_version', displayName: 'Version' })
  public __version: number;
}



@suite('model.generator.EntityGenerator')
class EntityGeneratorTest {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 100;
  public static readonly MANDANT = 1;
  public static readonly ROLE_ID = 2;
  public static readonly DELETED = false;
  public static readonly VERSION = 0;

  private tableMetadata: TableMetadata;
  private generator: EntityGenerator<ArtikelGenerator, number>;

  private items: ArtikelGenerator[];


  public before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelGenerator);
    this.generator = new EntityGenerator<ArtikelGenerator, number>({
      count: EntityGeneratorTest.ITEMS,
      maxCount: EntityGeneratorTest.MAX_ITEMS,
      tableMetadata: this.tableMetadata,
      idGenerator: new NumberIdGenerator(EntityGeneratorTest.MAX_ITEMS),
      columns: {
        mandant: new ConstantValueGenerator(EntityGeneratorTest.MANDANT),
        role: new ConstantValueGenerator(EntityGeneratorTest.ROLE_ID),
        deleted: new ConstantValueGenerator(EntityGeneratorTest.DELETED),
        __version: new ConstantValueGenerator(EntityGeneratorTest.VERSION),
      }
    });

    this.items = this.generator.generate();
  }


  @test 'should exist tableMetadata'() {
    return expect(this.tableMetadata).to.be.not.null;
  }

  @test 'should exist generator'() {
    expect(this.generator).to.be.not.null;
  }

  @test 'should have expected items'() {
    expect(this.items).to.be.not.null;
    expect(this.items.length).to.equal(EntityGeneratorTest.ITEMS);
  }

  @test 'should have expected column values'() {
    for (let i = 0; i < EntityGeneratorTest.ITEMS; i++) {
      expect(this.items[i].id).to.equal(i + 1);
    }
    this.items.forEach((item) => {
      expect(item.__version).to.equal(EntityGeneratorTest.VERSION);
      expect(item.deleted).to.equal(EntityGeneratorTest.DELETED);
      expect(item.mandant).to.equal(EntityGeneratorTest.MANDANT);
    });

  }

}