import { Injectable } from 'injection-js';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Hero, HeroTaxReturn } from './hero';

@Injectable()
export class HeroesService {
  public heroes: Hero[] = [
    { id: 1, name: 'RubberMan', tid: '082-27-5678' },
    { id: 2, name: 'Tornado', tid: '099-42-4321' }
  ];

  public heroTaxReturns: HeroTaxReturn[] = [
    new HeroTaxReturn(10, this.heroes[0], 35000),
    new HeroTaxReturn(20, this.heroes[1], 1250000)
  ];

  public getHeroes(): Observable<Hero[]> {
    return new Observable<Hero[]>((observer: Observer<Hero[]>) => {
      observer.next(this.heroes);
      observer.complete();
    });
  }

  public getTaxReturn(hero: Hero): Observable<HeroTaxReturn> {
    return new Observable<HeroTaxReturn>((observer: Observer<HeroTaxReturn>) => {
      const htr = this.heroTaxReturns.find((t) => t.hero.id === hero.id);
      observer.next(htr || new HeroTaxReturn(0, hero));
      observer.complete();
    });
  }

  public saveTaxReturn(heroTaxReturn: HeroTaxReturn): Observable<HeroTaxReturn> {
    return new Observable<HeroTaxReturn>((observer: Observer<HeroTaxReturn>) => {
      const htr = this.heroTaxReturns.find((t) => t.id === heroTaxReturn.id);
      if (htr) {
        heroTaxReturn = Object.assign(htr, heroTaxReturn); // demo: mutate
      } else {
        this.heroTaxReturns.push(heroTaxReturn);
      }
      observer.next(heroTaxReturn);
      observer.complete();
    });
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/