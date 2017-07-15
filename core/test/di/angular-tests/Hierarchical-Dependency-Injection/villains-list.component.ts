import { FlxComponent } from '../../../../src/di/flx-component.decorator';

import { Observable } from 'rxjs/Observable';

import { Villain, VillainsService } from './villains.service';

@FlxComponent({
  // selector: 'villains-list',
  // templateUrl: './villains-list.component.html',
  providers: [ VillainsService ]
})
export class VillainsListComponent {
  public villains: Observable<Villain[]>;

  constructor(private villainsService: VillainsService) {
    this.villains = villainsService.getVillains();
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/