// tslint:disable:max-classes-per-file

import { FlxModule } from '../../../lib/di/flx-module.decorator';


// missing @Module decorator
class NoModule {
}


@FlxModule({
  imports: [
    NoModule    // -> assertion: no module
  ]
})
export class TestModule {
}