import path = require('path');
import 'reflect-metadata';

// -------------------------------------- logging --------------------------------------------
import { configure, getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Logging konfigurieren ...
import { fromEnvironment } from '@fluxgate/core';
import { ConfigurationException, Types } from '@fluxgate/core';
import { Logging } from '@fluxgate/node';

const systemMode = fromEnvironment('NODE_ENV', 'development');
const loggingConfigPath = path.join(__dirname, `config/log4js.${systemMode}.json`);

// Logging.configureLogging('starter', systemMode);
configure(loggingConfigPath);


// Fluxgate/bootstrap
import { ModuleMetadataStorage } from '@fluxgate/core';
import { ServerModule } from './server.module';
ModuleMetadataStorage.instance.bootstrapModule(ServerModule);

// Fluxgate
import { JsonReader } from '@fluxgate/node';
import { /* EmailService, */ ExpressServer, IServerConfiguration, ServerSettings } from '@fluxgate/server';


const rootDir = path.join(__dirname);

const logger = getLogger(ExpressServer);




@ServerSettings({
  debug: true,

  rootDir: rootDir,
  mount: {
    '/rest': `${rootDir}/controllers/**/*.js`
  },
  componentsScan: [
    `${rootDir}/services/**/*.js`,
    `${rootDir}/middlewares/**/*.js`
  ],
  acceptMimes: ['application/json']  // add your custom configuration here
})
export class StarterServer extends ExpressServer {
  constructor(configuration: IServerConfiguration) {
    super(rootDir, configuration);
  }
}


using(new XLog(logger, levels.INFO, 'Server-Initialisierung'), (log) => {

  const serverConfigPath = path.join(__dirname, `config/server.${systemMode}.json`);

  //
  // Konfiguration lesen und in AppRegistry ablegen
  //
  const config = JsonReader.readJsonSync<IServerConfiguration>(serverConfigPath);
  log.info(`read server config from ${serverConfigPath} for systemMode = ${systemMode}`);

  if (!Types.isPresent(config)) {
    throw new ConfigurationException(`Server configuration undefined.`);
  }




  new StarterServer(config).Initialize().then(() => {
    // const emailService = InjectorService.get<EmailService>(EmailService);

    // emailService.send({
    //   from: 'walter',
    //   to: 'chrristian',
    //   subject: 'subject',
    //   bcc: '',
    //   cc: '',
    //   text: 'text'
    // }).then((res) => {
    //   // ok
    // });
  }, (err) => {
    log.error(err);
  });
});