// tslint:disable:max-classes-per-file
// tslint:disable:member-access

// tslint:disable-next-line:no-var-requires
require('reflect-metadata');


import * as chai from 'chai';
import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';

import { AssertionError } from '../../../../src/util';

import { Column, ColumnTypes, Enum, MetadataStorage, Table, TableMetadata } from '../../../../src/model';




@Table({ name: ArtikelEnum.TABLE_NAME })
class ArtikelEnum {
    public static readonly TABLE_NAME = 'artikel';

    @Column({ name: 'artikel_id', primary: true, generated: true })
    public id: number;

    @Column({ name: 'artikel_name', displayName: 'Name' })
    public name: string;


    @Enum((dataSource) => KollektionEnum)
    @Column({ name: 'id_kollektion', nullable: true })
    public id_kollektion?: number;
}


@Table({ name: 'kollektion' })
class KollektionEnum {

    @Column({ name: 'kollektion_id', primary: true, generated: true })
    public id: number;

    @Column({ name: 'kollektion_name' })
    public name: string;
}




@suite('model.decorator.Enum')
class EnumTest {
    private tableMetadata: TableMetadata;

    @test 'should exist tableMetadata'() {
        return expect(this.tableMetadata).to.be.not.null;
    }

    @test 'should exist columnMetadata'() {
        expect(this.tableMetadata.columnMetadata).to.be.not.null;
        expect(this.tableMetadata.columnMetadata.length).to.equal(3);
    }

    @test 'should exist dataSource'() {
        const propertyName = 'id_kollektion';
        const colMetaData = this.tableMetadata.getColumnMetadataByProperty(propertyName);
        expect(colMetaData).to.be.not.null;
        expect(colMetaData.propertyName).to.equal(propertyName);
        expect(colMetaData.propertyType).to.equal(ColumnTypes.NUMBER);

        expect(colMetaData.enumMetadata).to.be.not.null;
        expect(colMetaData.enumMetadata.dataSource).to.be.not.null;
        expect(colMetaData.enumMetadata.dataSource).to.equal(KollektionEnum);
    }


    protected before() {
        this.tableMetadata = MetadataStorage.instance.findTableMetadata(ArtikelEnum);
    }

}