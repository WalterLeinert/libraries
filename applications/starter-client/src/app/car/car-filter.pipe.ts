import { Pipe, PipeTransform } from '@angular/core';

import { Car } from '@fluxgate/starter-common';

@Pipe({
  name: 'appCarFilter'
})
export class CarFilterPipe implements PipeTransform {

  public transform(value: Car[], filterBy: string): Car[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy ? value.filter((car: Car) =>
      car.name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
