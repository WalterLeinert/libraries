import { Column, FlxEntity, Table } from '@fluxgate/common';


/**
 * Hilfstabelle für diverse Persistence-Tests (optimistic locking, Versionierung, etc.)
 *
 * @export
 * @class QueryTest
 * @implements {IFlxEntity<number>}
 */
@Table({ name: QueryTest.TABLE_NAME })
export class QueryTest extends FlxEntity<number> {
  public static readonly TABLE_NAME = 'querytest';

  @Column({ primary: true, generated: true })
  public id: number;

  @Column({ displayName: 'Name' })
  public name: string;

  // @Test()
  @Column({ name: 'test' })
  public __test: number;
}