import { Column } from '../model/decorator/column';
import { Table } from '../model/decorator/table';
import { FlxStatusEntity } from '../model/flx-status-entity';


/**
 * Hilfstabelle für diverse Persistence-Tests (optimistic locking, Versionierung, etc.)
 *
 * @export
 * @class QueryTest
 * @implements {FlxStatusEntity<number>}
 */
@Table({ name: QueryTest.TABLE_NAME })
export class QueryTest extends FlxStatusEntity<number> {
  public static readonly TABLE_NAME = 'querytest';

  @Column({ primary: true, generated: true })
  public id: number;

  @Column({ displayName: 'Name' })
  public name: string;

  // @Test()
  @Column({ name: 'test' })
  public __test: number;
}