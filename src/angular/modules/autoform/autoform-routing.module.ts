import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Fluxgate
import { Constants } from '@fluxgate/common';

import { AutoformComponent } from './autoform.component';
import { AutoformConstants } from './autoformConstants';


const routes: Routes = [
    {
        path: AutoformConstants.GENERIC_TOPIC,
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