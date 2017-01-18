import { Logger, levels, configure, getLogger } from 'log4js';
import { $log } from 'ts-log-debug';

// Fluxgate
import { fromEnvironment, LoggingConfiguration, FileSystem } from '@fluxgate/common';

export class Logging {

    /**
     * Konfiguriert das Log4js-Logging
     */
    public static configureLogging(packageName: string, systemMode: string) {
        if (systemMode) {
            let configPath = LoggingConfiguration.getConfigurationPath(systemMode);

            if (FileSystem.fileExists(configPath)) {
                $log.info(`[${packageName}]: log4js: systemMode = ${systemMode}, configPath = ${configPath}`);

                configure(configPath, { reloadSecs: 10 });
            } else {
                $log.warn(`[${packageName}]: log4js: cannot read configuration: ${configPath}`);
            }

        } else {
            $log.warn(`[${packageName}]: log4js: no systemMode defined -> not reading configuration`);
        }
    }

}