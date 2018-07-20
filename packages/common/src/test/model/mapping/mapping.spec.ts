// tslint:disable:max-classes-per-file
// tslint:disable:member-access
// tslint:disable:no-unused-expression

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');

import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';


import { ITableMapping } from '../../../lib/model/mapping';
import { ColumnTypes } from '../../../lib/model/metadata/columnTypes';


import { Column, MetadataStorage, Table, TableMetadata } from '../../../lib/model';


@Table({ name: ArtikelMapping.TABLE_NAME })
class ArtikelMapping {
  public static readonly TABLE_NAME = 'artikel';

  @Column({ name: 'artikel_id', primary: true, generated: true })
  public id: number;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;
}



@suite('model.mapping')
class MapingTest {
  private tableMetadata: TableMetadata;

  @test 'should create mapping'() {
    const mappings: ITableMapping[] = [
      {
        name: 'ArtikelMapping',
        options: {
          name: 'artikel',
          isView: false
        },
        columns: [
          {
            name: 'id',
            options: {
              name: 'artikel_id',
              type: ColumnTypes.NUMBER,
              primary: true,
              displayName: 'Id'
            }
          },
          {
            name: 'name',
            propertyType: ColumnTypes.STRING,
            options: {
              name: 'artikel_name',
              type: ColumnTypes.STRING,
              primary: true,
              displayName: 'Id'
            }
          }
        ]
      }
    ];


    expect(mappings).to.be.not.null;


    mappings.forEach((mapping) => {
      const tableMetadata = MetadataStorage.instance.findTableMetadata(mapping.name);
      expect(tableMetadata).to.be.not.null;
      expect(tableMetadata.className).to.equal(mapping.name);


      mapping.columns.forEach((colMapping) => {
        const colMetadata = tableMetadata.getColumnMetadataByProperty(colMapping.name);
        expect(colMetadata).to.be.not.null;
      });
    });
  }


  protected before() {
    this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelMapping);
  }

}