export type Strategy = 'nop' | 'cache' | 'service';

export class Strategies {
  public static NOP: Strategy = 'nop';
  public static CACHE: Strategy = 'cache';
  public static SERVICE: Strategy = 'service';
}