import { Injectable } from 'injection-js';

import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';

// tslint:disable-next-line:interface-name
export interface Villain { id: number; name: string; }

@Injectable()
export class VillainsService {
  public villains: Villain[] = [
    { id: 1, name: 'Dr. Evil' },
    { id: 2, name: 'Moriarty' }
  ];

  public getVillains(): Observable<Villain[]> {
    return of(this.villains);
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/