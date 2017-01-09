import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Fluxgate
import { Constants } from '@fluxgate/common'

import { AutoformConstants } from './autoformConstants';
import { AutoformComponent } from './autoform.component';


const routes: Routes = [
    {
        path: AutoformConstants.GENERIC_TOPIC + Constants.PATH_SEPARATOR + ':' + AutoformConstants.GENERIC_ID,
        component: AutoformComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
})
export class AutoformRoutingModule { }