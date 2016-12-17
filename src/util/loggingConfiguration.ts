import path = require('path');
import { fromEnvironment } from '.';

export class LoggingConfiguration {

    public static getConfigurationPath(systemMode: string) {     
        let configFile = 'log4js.' + systemMode + '.json';
        let configPath = path.join('/config', configFile);
        configPath = path.join(process.cwd(), configPath);

        return configPath;
    }
}