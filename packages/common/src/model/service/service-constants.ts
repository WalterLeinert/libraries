/**
 * Definiert Konstanten für die Rest-APIs der Controller
 *
 * @export
 * @class ServiceConstants
 */
export class ServiceConstants {
  /**
   * default verb für Create-Operation -> z.B. /rest/artikel/create
   */
  public static CREATE = 'create';

  /**
   * default verb für Find-Operation -> z.B. /rest/artikel/find
   */
  public static FIND = 'find';

  /**
   * default verb für Query-Operation -> z.B. /rest/artikel/query
   */
  public static QUERY = 'query';

  /**
   * default verb für Update-Operation -> z.B. /rest/artikel/update
   */
  public static UPDATE = 'update';

  /**
   * default verb für FindById-Operation -> z.B. /rest/artikel/:12
   */
  public static FIND_BY_ID = ':id';

  /**
   * default verb für Delete-Operation -> z.B. /rest/artikel/:12
   */
  public static DELETE = ':id';
}