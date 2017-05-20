// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { configure, IConfig, JsonSerializer, ShortTime } from '@fluxgate/core';

import { ClientColumn, Column, IEntity, Table } from '../../../src/model';


@Table({ name: ArtikelSerialization.TABLE_NAME })
class ArtikelSerialization implements IEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;

  @ClientColumn({ name: 'id_client' })
  public id_client?: number;

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


  @test 'should serialize entity'() {
    const test = new ArtikelSerialization();
    test.id = 1;
    test.name = 'Hemd';
    test.id_client = 2;
    test.created = new Date('2017-05-10');
    test.start = new ShortTime(8, 30);

    const testSerialized = this.formatter.serialize(test);
    const testDeserialized = this.formatter.deserialize(testSerialized);
    expect(test).to.eql(testDeserialized);
  }

  public before() {


    configure(this.config);
  }

}