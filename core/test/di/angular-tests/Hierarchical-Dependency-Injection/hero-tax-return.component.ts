import { FlxComponent } from '../../../../src/di/flx-component.decorator';

import { EventEmitter, Input, Output } from '@angular/core';
import { HeroTaxReturn } from './hero';
import { HeroTaxReturnService } from './hero-tax-return.service';

@FlxComponent({
  // selector: 'hero-tax-return',
  // templateUrl: './hero-tax-return.component.html',
  // styleUrls: ['./hero-tax-return.component.css'],
  providers: [HeroTaxReturnService]
})
export class HeroTaxReturnComponent {
  public message = '';
  @Output() close = new EventEmitter<void>();

  public get taxReturn(): HeroTaxReturn {
    return this.heroTaxReturnService.taxReturn;
  }

  @Input()
  public set taxReturn(htr: HeroTaxReturn) {
    this.heroTaxReturnService.taxReturn = htr;
  }

  constructor(private heroTaxReturnService: HeroTaxReturnService) { }

  public onCanceled() {
    this.flashMessage('Canceled');
    this.heroTaxReturnService.restoreTaxReturn();
  }

  public onClose() {
    this.close.emit();
  }

  public onSaved() {
    this.flashMessage('Saved');
    this.heroTaxReturnService.saveTaxReturn();
  }

  public flashMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 500);
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/