/**
 * Interface für Appender-Konfiguration
 *
 * @export
 * @interface IAppenderConfig
 */
export interface IAppenderConfig {
  /**
   * Typ des Appenders (z.B. file)
   */
  type: string;

  /**
   * Kategorie (Classname oder beliebiger String)
   */
  category?: string;

  /**
   * Log-Layout
   */
  layout?: {

    /**
     * Typ (z.B. pattern)
     */
    type: string;

    /**
     * typspezifische Konfiguration
     */
    [key: string]: any
  };
}

/**
 * Konfigurationsstruktur (-> wie bei log4js)
 *
 * @export
 * @interface IConfig
 */
export interface IConfig {
  /**
   * Liste der Appender
   */
  appenders: IAppenderConfig[];

  /**
   * Level-Konfiguration für Kategorien
   */
  levels?: { [category: string]: string };

  /**
   * TODO?
   */
  replaceConsole?: boolean;
}