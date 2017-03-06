import { Directive, ElementRef, EventEmitter, Input, NgModule } from '@angular/core';

@Directive({
    selector: '[flxFocus]'
})
export class FocusDirective {
    private focusEmitterSubscription: any;

    @Input('focus')
    set focus(focusEmitter: EventEmitter<any>) {
        if (this.focusEmitterSubscription) {
            this.focusEmitterSubscription.unsubscribe();
        }
        this.focusEmitterSubscription = focusEmitter.subscribe((() => this.element.nativeElement.focus()).bind(this));
    }

    constructor(private element: ElementRef) {
    }
}


// tslint:disable-next-line:max-classes-per-file
@NgModule({
    imports: [],
    exports: [FocusDirective],
    declarations: [FocusDirective]
})
export class FocusModule { }