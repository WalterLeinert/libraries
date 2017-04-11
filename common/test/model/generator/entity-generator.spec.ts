// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { ConfigurationException, InvalidOperationException } from '../../../src/exceptions';
import { Client, Column, IFlxEntity, MetadataStorage, Table, TableMetadata, Version } from '../../../src/model';
import { ConstantValueGenerator } from '../../../src/model/generator/constant-value-generator';
import { EntityGenerator } from '../../../src/model/generator/entity-generator';
import { NumberIdGenerator } from '../../../src/model/generator/number-id-generator';
import { ShortTime, Time } from '../../../src/types';


@Table({ name: ArtikelGenerator.TABLE_NAME })
class ArtikelGenerator implements IFlxEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ primary: true, generated: true })
  public id: number;

  @Column()
  public name: string;

  @Column()
  public booleanProperty?: boolean;

  @Column({ propertyType: 'int' })
  public intProperty: number;

  @Column({ propertyType: 'integer' })
  public integerProperty: number;

  @Column({ propertyType: 'bigint' })
  public bigintProperty: number;

  @Column({ propertyType: 'float' })
  public floatProperty: number;

  @Column({ propertyType: 'double' })
  public doubleProperty: number;

  @Column({ propertyType: 'text' })
  public textProperty: string;

  @Column({ propertyType: 'string' })
  public stringProperty: string;

  @Column({ propertyType: 'date' })
  public dateProperty: Date;

  @Column({ propertyType: 'datetime' })
  public datetimeProperty: Date;

  @Column({ propertyType: 'time' })
  public timeProperty: Time;

  @Column({ propertyType: 'shorttime' })
  public shorttimeProperty: ShortTime;

  @Column()
  public deleted?: boolean;

  @Client()
  @Column()
  public mandant?: number;

  @Version()
  @Column()
  public __version: number;
}



@suite('model.generator.EntityGenerator')
class EntityGeneratorTest {
  public static readonly ITEMS = 10;
  public static readonly MAX_ITEMS = 25;
  public static readonly MANDANT = 1;
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

  @test 'should have expected ids'() {
    for (let i = 0; i < EntityGeneratorTest.ITEMS; i++) {
      expect(this.items[i].id).to.equal(i + 1);
    }
  }


  @test 'should have expected constant column values'() {
    this.items.forEach((item) => {
      expect(item.__version).to.equal(EntityGeneratorTest.VERSION);
      expect(item.deleted).to.equal(EntityGeneratorTest.DELETED);
      expect(item.mandant).to.equal(EntityGeneratorTest.MANDANT);
    });
  }


  @test 'should have expected column values'() {
    for (let i = 0; i < EntityGeneratorTest.ITEMS; i++) {
      const item = this.items[i];
      expect(item.name).to.equal(`name-${i + 1}`);
    }
  }


  @test 'should test nextId'() {
    for (let i = 0; i < 10; i++) {
      const nextId = this.generator.nextId();
      expect(nextId).to.equal(EntityGeneratorTest.ITEMS + i + 1);
    }
  }


  @test 'should create new item'() {
    for (let i = 0; i < 10; i++) {
      const item = this.generator.createEntity<ArtikelGenerator>();
      expect(item).to.be.not.null;
      expect(item.id).to.be.undefined;

      item.id = this.generator.nextId();
      expect(item.id).not.to.be.undefined;
      expect(item.id).to.equal(this.generator.currentId());
    }
  }

  @test 'should test remaining items(total: maxCount) + error for > maxCount'() {
    for (let i = this.generator.currentId(); i < EntityGeneratorTest.MAX_ITEMS; i++) {
      const item = this.generator.createEntity<ArtikelGenerator>();
      expect(item).to.be.not.null;
      expect(item.id).to.be.undefined;

      item.id = this.generator.nextId();
      expect(item.id).not.to.be.undefined;
      expect(item.id).to.equal(this.generator.currentId());
    }

    expect(() => this.generator.nextId()).to.throw(InvalidOperationException);
  }
}




@suite('model.generator.EntityGenerator.invalidProperty')
class EntityGeneratorInvalidPropertyTest {
  public static readonly ITEMS = 1;
  public static readonly INVALID = 0;


  @test 'should throw exception for invalid property'() {
    const tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelGenerator);

    expect(() => new EntityGenerator<ArtikelGenerator, number>({
      count: EntityGeneratorTest.ITEMS,
      tableMetadata: tableMetadata,
      idGenerator: new NumberIdGenerator(EntityGeneratorInvalidPropertyTest.ITEMS),
      columns: {
        invalid: new ConstantValueGenerator(EntityGeneratorInvalidPropertyTest.INVALID)
      }
    })).to.throw(ConfigurationException);
  }

}