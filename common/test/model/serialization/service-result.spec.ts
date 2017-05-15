// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { configure, IConfig, JsonSerializer, ShortTime } from '@fluxgate/core';

import { Client, Column, FindByIdResult, IEntity, Table } from '../../../src/model';



@Table({ name: ArtikelFindByIdResultSerialization.TABLE_NAME })
class ArtikelFindByIdResultSerialization implements IEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;

  @Client()
  @Column({ name: 'id_mandant' })
  public id_mandant?: number;

  @Column({ name: 'artikel_created' })
  public created: Date;

  @Column({ name: 'artikel_start' })
  public start: ShortTime;
}


@suite('model.decorator (serialization)')
class ModelSerializationTest {
  private formatter = new JsonSerializer();

  config: IConfig = {
    appenders: [
    ],

    levels: {
      '[all]': 'WARN',
      'JsonSerializer': 'WARN'
    }
  };


  @test 'should serialize FindByIdResult'() {
    const model = new ArtikelFindByIdResultSerialization();
    model.id = 1;
    model.name = 'Hemd';
    model.id_mandant = 2;
    model.created = new Date('2017-05-10');
    model.start = new ShortTime(8, 30);

    const test = new FindByIdResult(model, 1);


    const testSerialized = this.formatter.serialize(test);
    const testDeserialized = this.formatter.deserialize(testSerialized);
    expect(test).to.eql(testDeserialized);
  }


  public before() {
    configure(this.config);
  }

}