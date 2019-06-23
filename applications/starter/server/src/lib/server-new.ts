import * as Express from 'express';
import Path = require('path');
import { ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware } from 'ts-express-decorators';

// Server-Rootdir (zur Laufzeit)
const rootDir = Path.join(__dirname);

@ServerSettings({
  rootDir: rootDir,
  mount: {
    '/rest': `${rootDir}/controllers/**/*.js`
  },
  componentsScan: [
    `${rootDir}/services/**/*.js`,
    `${rootDir}/middlewares/**/*.js`
  ],
  acceptMimes: ['application/json'],
  port: 8888,
  debug: true,
})
export class Server extends ServerLoader {

  /**
   * This method let you configure the middleware required by your application to works.
   * @returns {Server}
   */
  public $onMountingMiddlewares(): void | Promise<any> {

    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const compress = require('compression');
    const methodOverride = require('method-override');


    this
      .use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));

    return null;
  }

  public $onReady() {
    console.log('Server started...');
  }

  public $onServerInitError(err) {
    console.error(err);
  }
}

new Server().start();