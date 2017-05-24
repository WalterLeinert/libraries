// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { Clone, ConfigurationException, InvalidOperationException, ShortTime, Time } from '@fluxgate/core';

import {
  Column, FlxEntity, MetadataStorage, Table, TableMetadata
} from '../../../src/model';
import { ConstantValueGenerator } from '../../../src/model/generator/constant-value-generator';
import { DateValueGenerator } from '../../../src/model/generator/date-value-generator';
import { DatetimeValueGenerator } from '../../../src/model/generator/datetime-value-generator';
import { EntityGenerator } from '../../../src/model/generator/entity-generator';
import { NumberIdGenerator } from '../../../src/model/generator/number-id-generator';
import { ShortTimeValueGenerator } from '../../../src/model/generator/shortTime-value-generator';
import { TimeValueGenerator } from '../../../src/model/generator/time-value-generator';


@Table({ name: ArtikelGenerator.TABLE_NAME })
class ArtikelGenerator extends FlxEntity<number> {
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
        __client: new ConstantValueGenerator(EntityGeneratorTest.MANDANT),
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
      expect(item.__client).to.equal(EntityGeneratorTest.MANDANT);
    });
  }


  @test 'should have expected column values'() {
    for (let i = 0; i < EntityGeneratorTest.ITEMS; i++) {
      const item = this.items[i];
      expect(item.name).to.equal(`name-${i + 1}`);
      expect(item.dateProperty).to.deep.equal(this.addDays(DateValueGenerator.INITIAL_VALUE, i));
      expect(item.datetimeProperty).to.deep.equal(this.addMinutes(DatetimeValueGenerator.INITIAL_VALUE, i));

      expect(item.shorttimeProperty).to.deep.equal(
        ShortTime.createFromMinutes(ShortTimeValueGenerator.INITIAL_VALUE.toMinutes() + i));
      expect(item.timeProperty).to.deep.equal(
        Time.createFromSeconds(TimeValueGenerator.INITIAL_VALUE.toSeconds() + i));
    }
  }


  @test 'should test nextId'() {
    for (let i = 0; i < 10; i++) {
      const nextId = this.generator.nextId();
      expect(nextId).to.equal(EntityGeneratorTest.ITEMS + i + 1);
    }
  }


  @test 'should test createItem'() {
    const item = this.generator.createItem(true);
    expect(item).to.be.not.null;
    expect(item.id).not.to.be.undefined;
    expect(item.id).to.equal(this.generator.currentId());
  }

  @test 'should test createItem (without id)'() {
    const item = this.generator.createItem(false);
    expect(item).to.be.not.null;
    expect(item.id).to.be.undefined;
  }


  @test 'should create new entity'() {
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

  private addDays(date: Date, days: number): Date {
    const d = Clone.clone(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  private addMinutes(date: Date, minutes: number): Date {
    const d = Clone.clone(date);
    d.setMinutes(d.getMinutes() + minutes);
    return d;
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


@suite('model.generator.EntityGenerator.missingColumns')
class EntityGeneratorMissingColumnsTest {
  public static readonly ITEMS = 1;
  public static readonly INVALID = 0;


  @test 'should not throw exception for missing columns'() {
    const tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelGenerator);

    expect(() => new EntityGenerator<ArtikelGenerator, number>({
      count: EntityGeneratorTest.ITEMS,
      tableMetadata: tableMetadata,
      idGenerator: new NumberIdGenerator(EntityGeneratorInvalidPropertyTest.ITEMS)
    })).not.to.throw();
  }

}