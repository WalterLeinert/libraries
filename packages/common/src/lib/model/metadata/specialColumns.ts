
export type SpecialColumn =
  'Client' |
  'Version' |
  'PrimaryKey' |
  'Secret' |
  'Test';


export class SpecialColumns {
  public static CLIENT: SpecialColumn = 'Client';
  public static VERSION: SpecialColumn = 'Version';
  public static PRIMARY_KEY: SpecialColumn = 'PrimaryKey';
  public static SECRET: SpecialColumn = 'Secret';
  public static TEST: SpecialColumn = 'Test';
}