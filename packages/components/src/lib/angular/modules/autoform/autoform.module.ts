import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/components/button/button';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { SharedModule } from 'primeng/components/common/shared';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { FieldsetModule } from 'primeng/components/fieldset/fieldset';
import { MessagesModule } from 'primeng/components/messages/messages';

import { MessageService, MetadataService } from '@fluxgate/client';

import { ConfirmationDialogModule } from '../common/confirmation-dialog/confirmation-dialog.component';
import { AutofocusModule } from '../directives/autofocus.directive';
import { DropdownSelectorModule } from '../dropdown-selector/dropdown-selector.module';
import { TimeSelectorModule } from '../time-selector/time-selector.module';
import { AutoformControlsModule } from './autoform-controls/autoform-controls.module';
import { AutoformDialogComponent } from './autoform-dialog.component';
import { AutoformComponent } from './autoform.component';
import { AutoformInputModule } from './input/autoform-input.module';


@NgModule({
  imports: [
    // Angular
    CommonModule,
    ReactiveFormsModule,

    // PrimeNG
    ButtonModule,
    CheckboxModule,
    SharedModule,
    MessagesModule,
    DialogModule,
    CalendarModule,
    ConfirmDialogModule,
    FieldsetModule,

    // Fluxgate
    AutofocusModule,
    TimeSelectorModule,
    DropdownSelectorModule,
    ConfirmationDialogModule,

    AutoformControlsModule
  ],
  exports: [
    AutoformComponent,
    AutoformDialogComponent
  ],
  declarations: [
    AutoformComponent,
    AutoformDialogComponent
  ],
  providers: [
    MessageService,
    MetadataService
  ]
})
export class AutoformModule { }