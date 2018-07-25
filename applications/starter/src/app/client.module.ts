// import { ComponentsModule } from '@fluxgate/components';
import { FlxModule } from '@fluxgate/core';

import { ClientComponent } from './client.component';

@FlxModule({
  imports: [
    // ComponentsModule
  ],
  declarations: [
    ClientComponent
  ],
  bootstrap: [
    ClientComponent
  ]
})
export class ClientModule {
}