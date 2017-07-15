
export class Hero {
  public id: number;
  public name: string;
  public tid: string; // tax id
}

//// HeroTaxReturn ////
let nextId = 100;

// tslint:disable-next-line:max-classes-per-file
export class HeroTaxReturn {
  constructor(
    public id = nextId++,
    public hero: Hero,
    public income = 0) {
    if (id === 0) { id = nextId++; }
  }

  get name() { return this.hero.name; }
  get tax() { return this.income ? .10 * this.income : 0; }
  get tid() { return this.hero.tid; }

  public toString() {
    return `${this.hero.name}`;
  }

  public clone() {
    return new HeroTaxReturn(this.id, this.hero, this.income);
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/