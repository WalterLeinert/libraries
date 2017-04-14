export interface IAppenderConfig {
    type: string;
    category?: string;
    layout?: {
        type: string;
        [key: string]: any;
    };
}
/**
 * Konfigurationsstruktur (-> wie bei log4js)
 *
 * @export
 * @interface IConfig
 */
export interface IConfig {
    appenders: IAppenderConfig[];
    levels?: {
        [category: string]: string;
    };
    replaceConsole?: boolean;
}
