import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'flx-popup',
  template: `
    <div class="absolute">
        <div class="container-fluid custom-modal-container">
            <div class="row custom-modal-header">
                <div class="col-sm-12">
                    <h3>{{title}}</h3>
                </div>
            </div>
            <div class="row" [ngClass]="{'myclass' : shouldUseMyClass}">
                <div class="col-sm-12">
                    <div class="jumbotron">
                        <p class="lead">{{message}}</p>
                        <br>
                        <div class="actions segments">
                            <button class="btn" id="cancelButton" (click)="onClick(false)">
                        <i class="remove icon"></i>Nein</button>
                            <button class="btn" id="approveButton" (click)="onClick(true)">
                        <i class="checkmark icon"></i>Ja</button>
                            <button pButton type="text" (click)="onClick(true)" icon="fa-check" label="Click"></button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>    
  `,
  styles: [`
    div.absolute {
        position: absolute;
        top: 80px;
        left: 100;
        width: 600px;
        height: 300px;
        border: 3px solid black;
        background: #ffad5d;
    }  
  `]
})


export class PopupComponent {
  @Input() message: string = '';
  @Input() title: string = '';

  @Output() public onAnswer: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor() {
  }


  onClick(event: boolean) {
    console.log('message inside modal-component: ' + event);
    this.onAnswer.next(event);

    // this.dialog.close();

  }

}