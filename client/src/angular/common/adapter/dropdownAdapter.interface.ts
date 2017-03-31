import { Observable } from 'rxjs/Observable';

/**
 * Interface für Adapter zur Anbindung von Wertelisten an DropDown-Controls 
 */
export interface IDropdownAdapter {
    /**
     * Die beim konkreten Control verwendete Optionsliste (kapselt ggf. die Werteliste)
     */
    data: any[];

    /**
     * Liefert den Wert der ursprünglich angebundenen Werteliste für den Index @param{index}.
     */
    getValueAt(index: number): Observable<any>;
}