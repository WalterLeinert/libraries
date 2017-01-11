/**
 * Die Konfiguration eines einzelnen Formularfelds
 */
export interface IFieldOptions {
    /**
     * der Anzeigename (Label)
     */
    displayName?: string;
}


/**
 * Die Konfiguration des Formulars
 */
export interface IAutoformConfig {
    /**
     * Liste der Formukarfelder, die nicht angezeigt werden
     */
    hiddenFields?: string[];

    /**
     * Konfiguration einzelner Formularfelder
     */
    fields: { [name: string]: IFieldOptions };
}

/**
 * Interface für die Navigation auf das generische Formular Autoform (@see{AutoformComponent})
 */
export interface IAutoformNavigation {
    /**
     * Die Id der zugehörigen Entity
     */
    entityId: any;

    /**
     * Der Name der zugehörigen Entity-Klasse
     */
    entity: string;

    /**
     * die Konfiguration des Formulars @see{IAutoformConfig} als JSON-String
     */
    autoformConfig?: string;
}