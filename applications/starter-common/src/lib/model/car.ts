import { FlxEntity, IdColumn } from '@fluxgate/common';

//
// Tabelle car
//

import { Column, Table } from '@fluxgate/common';


@Table({ name: Car.TABLE_NAME })
export class Car extends FlxEntity<number> {
  public static readonly TABLE_NAME = 'car';

  @IdColumn({ name: 'car_id' })
  public id: number;

  @Column({ name: 'car_name', displayName: 'Name' })
  public name: string;

  @Column({ name: 'car_color', displayName: 'Farbe', nullable: true })
  public color?: string;
}