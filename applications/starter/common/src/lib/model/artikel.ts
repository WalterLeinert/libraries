import { FlxStatusEntity, IdColumn } from '@fluxgate/common';

//
// Tabelle artikel
//

import { Column, Table } from '@fluxgate/common';


@Table({ name: Artikel.TABLE_NAME })
export class Artikel extends FlxStatusEntity<number> {
  public static readonly TABLE_NAME = 'artikel';

  @IdColumn({ name: 'artikel_id' })
  public id: number;

  @Column({ name: 'id_kollektion', nullable: true })
  public idKollektion?: number;

  @Column({ name: 'artikel_nummer', displayName: 'Nummer' })
  public nummer: string;

  @Column({ name: 'artikel_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'artikel_extrabarcode', displayName: 'Extrabarcode', nullable: true })
  public extrabarcode?: string;

  @Column({ name: 'lagerplatz_id', nullable: true })
  public lagerplatzId?: number;

  @Column({ name: 'artikel_saison', displayName: 'Saison', nullable: true })
  public saison?: string;

  @Column({ name: 'artikel_teil1', displayName: 'Teil 1', nullable: true })
  public teil1?: string;

  @Column({ name: 'artikel_teil2', displayName: 'Teil 2', nullable: true })
  public teil2?: string;
}