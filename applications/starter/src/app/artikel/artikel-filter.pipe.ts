import { Pipe, PipeTransform } from '@angular/core';

import { Artikel } from '@fluxgate/starter-common';

@Pipe({
  name: 'appArtikelFilter'
})
export class ArtikelFilterPipe implements PipeTransform {

  public transform(value: Artikel[], filterBy: string): Artikel[] {
    filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
    return filterBy ? value.filter((artikel: Artikel) =>
      artikel.name.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;
  }

}
