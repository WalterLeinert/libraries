import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// Fluxgate
import { Constants } from '@fluxgate/common'

import { AutoformComponent } from './autoform.component';


const routes: Routes = [
    { 
        path: AutoformComponent.GENERIC_TOPIC + Constants.PATH_SEPARATOR + ':' + AutoformComponent.GENERIC_ID,
        component: AutoformComponent 
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AutoformRoutingModule { }