import path = require('path');
import 'reflect-metadata';

// -------------------------------------- logging --------------------------------------------
import { getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

// Logging konfigurieren ...
import { fromEnvironment } from '@fluxgate/core';
import { ConfigurationException, Types } from '@fluxgate/core';
import { Logging } from '@fluxgate/node';

const systemMode = fromEnvironment('NODE_ENV', 'development');
Logging.configureLogging('starter', systemMode);


// Fluxgate/bootstrap
import { ModuleMetadataStorage } from '@fluxgate/core';
import { ServerModule } from './server.module';
ModuleMetadataStorage.instance.bootstrapModule(ServerModule);

// Fluxgate
import { JsonReader } from '@fluxgate/node';
import { /* EmailService, */ ExpressServer, IServerConfiguration } from '@fluxgate/server';



const logger = getLogger(ExpressServer);


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

  new ExpressServer(config).Initialize().then(() => {
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
  });
});