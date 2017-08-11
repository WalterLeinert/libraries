import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Field } from './field';

@Component({
  selector: 'flx-selectionlist',
  template: `
<div class="listitem" [ngClass]="{'selected':selectedRecord && datarecord.id == selectedRecord.id}"
  *ngFor="let datarecord of datarecords" (click)="onRecordClicked(datarecord)">

  <div class="w3-container">
    <div class="w3-row">
      <div *ngFor="let field of fields" class="w3-mobile" style="white-space:nowrap;">
        <div class="mainitem" *ngIf="field.main == true">
          {{ datarecord[field.fieldname] }}
        </div>
        <div class="normalitem" *ngIf="field.main == false">
          {{ datarecord[field.fieldname] }}
        </div>
      </div>
    </div>
  </div>
</div>
`,
  styles: [`
.listitem {
  background-color: #fafafa;
  width:100%;
  padding: 5px 5px 5px 10px;
  border-bottom: 1px solid #efefef;
}

.listitem:hover {
  background-color: #bddff3;
}

.selected {
  background-color: #0077c2;
  color: white;
}

.mainitem {
 font-size: 110%;
 font-weight: bold;
}

.normalitem {
  font-size: 90%;
  font-weight: normal;
}
`]
})
export class SelectionListComponent implements OnInit {
  @Input() public datarecords: any[];
  @Input() public fields: Field[];
  @Output() public onRecordSelect: EventEmitter<any> = new EventEmitter();

  public selectedRecord: any;

  public ngOnInit() {
    // OK
  }

  public onRecordClicked(selectedRecord: any) {
    this.selectedRecord = selectedRecord;
    this.onRecordSelect.emit(selectedRecord);
  }

}
