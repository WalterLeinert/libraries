import { $log } from 'ts-log-debug';

// Fluxgate
import { configure, FileSystem, LoggingConfiguration } from '@fluxgate/common';

export class Logging {

    /**
     * Konfiguriert das Log4js-Logging
     */
    public static configureLogging(packageName: string, systemMode: string) {
        if (systemMode) {
            const configPath = LoggingConfiguration.getConfigurationPath(systemMode);

            if (FileSystem.fileExists(configPath)) {
                $log.info(`[${packageName}]: logging: systemMode = ${systemMode}, configPath = ${configPath}`);

                configure(configPath, { reloadSecs: 10 });
            } else {
                $log.warn(`[${packageName}]: logging: cannot read configuration: ${configPath}`);
            }

        } else {
            $log.warn(`[${packageName}]: logging: no systemMode defined -> not reading configuration`);
        }
    }

}