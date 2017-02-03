import * as fs from 'fs';
import { FileSystem } from './fileSystem';

export class JsonReader {

    /**
     * Liest eine Json-Datei @param{jsonPath} und liefert das entsprechede Json-Objekt als @see{T} 
     */
    public static readJsonSync<T>(jsonPath: string): T {
        if (! FileSystem.fileExists(jsonPath)) {
            throw new Error(`Die Json-Konfiguration ${jsonPath} ist nicht lesbar oder existiert nicht.`);
        }

        try {
            const data = fs.readFileSync(jsonPath);
            return JSON.parse(data.toString()) as T;
        } catch (err) {
            // console.error(`Die Json-Konfiguration ${jsonPath} ist kein gültiges JSON-Format.`)
            throw new Error(`Die Json-Konfiguration ${jsonPath} ist kein gültiges JSON-Format.`);
        }
    }

    /**
     * Liest eine Json-Datei @param{jsonPath} und liefert das entsprechede Json-Objekt als @see{T} im Callback @see{cb}
     */
    public static readJson<T>(jsonPath: string, cb) {
        fs.readFile(jsonPath, (err, data) => {
            try {
                const config = JSON.parse(data.toString()) as T;
                cb(null, config);
            } catch (err) {
                console.error('Die Json-Konfiguration ${jsonPath} ist kein gültiges JSON-Format.');
                cb(err, null);
            }
        });
    }
}