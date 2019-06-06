import { FlxModule } from '@fluxgate/core';

import { ServerComponent } from './server.component';

@FlxModule({
  declarations: [
    ServerComponent
  ],
  bootstrap: [
    ServerComponent
  ]
})
export class ServerModule {
}