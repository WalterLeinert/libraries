import { NgModule, Directive, ElementRef, Input, EventEmitter } from '@angular/core';

@Directive({
    selector: '[flxFocus]'
})
export class FocusDirective {
    private focusEmitterSubscription;

    @Input('focus')
    set focus(focusEmitter: EventEmitter<any>) {
        if (this.focusEmitterSubscription) {
            this.focusEmitterSubscription.unsubscribe();
        }
        this.focusEmitterSubscription = focusEmitter.subscribe((() => this.element.nativeElement.focus()).bind(this))
    }

    constructor(private element: ElementRef) {
    }
}


@NgModule({
    imports: [],
    exports: [FocusDirective],
    declarations: [FocusDirective]
})
export class FocusModule { }