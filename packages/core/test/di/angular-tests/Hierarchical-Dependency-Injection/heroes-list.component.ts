import { FlxComponent } from '../../../../src/di/flx-component.decorator';

import { Observable } from 'rxjs';

import { Hero, HeroTaxReturn } from './hero';
import { HeroesService } from './heroes.service';

@FlxComponent({
  // selector: 'heroes-list',
  // template: `
  //   <div>
  //     <h3>Hero Tax Returns</h3>
  //     <ul>
  //       <li *ngFor="let hero of heroes | async"
  //           (click)="showTaxReturn(hero)">{{hero.name}}
  //       </li>
  //     </ul>
  //     <hero-tax-return
  //       *ngFor="let selected of selectedTaxReturns; let i = index"
  //       [taxReturn]="selected"
  //       (close)="closeTaxReturn(i)">
  //     </hero-tax-return>
  //   </div>
  //   `,
  // styles: ['li {cursor: pointer;}']
})
export class HeroesListComponent {
  public heroes: Observable<Hero[]>;
  public selectedTaxReturns: HeroTaxReturn[] = [];

  constructor(private heroesService: HeroesService) {
    this.heroes = heroesService.getHeroes();
  }

  public showTaxReturn(hero: Hero) {
    this.heroesService.getTaxReturn(hero)
      .subscribe((htr) => {
        // show if not currently shown
        if (!this.selectedTaxReturns.find((tr) => tr.id === htr.id)) {
          this.selectedTaxReturns.push(htr);
        }
      });
  }

  public closeTaxReturn(ix: number) {
    this.selectedTaxReturns.splice(ix, 1);
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/