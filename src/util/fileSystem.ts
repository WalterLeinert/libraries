import * as fs from 'fs';
import { Assert } from './assert';

/**
 * Hilfsklasse für Filesystemoperationen
 */
export class FilesSystem {

    /**
     * Liefert true, falls die Datei @param{path} existiert und lesbar ist.
     */
    public static fileExists(path: string): boolean {
        Assert.notNullOrEmpty(path);
        try {
            fs.accessSync(path, fs.constants.R_OK);
            return true;
        } catch (err) {
            return false;
        }
    }

    /**
     * Liefert true, falls der Pfad @param{path} ein Verzeichnis ist.
     */
    public static directoryExists(path: string): boolean {
        Assert.notNullOrEmpty(path);
        try {
            return fs.statSync(path).isDirectory();
        } catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            } else {
                throw err;
            }
        }
    }
}