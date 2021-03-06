import * as fs from 'fs';

import { Assert } from '@fluxgate/core';


/**
 * Hilfsklasse für Filesystem-Operationen
 */
export class FileSystem {

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


  /**
   * Liefert den Inhalt der Datei unter dem Pfad @param{path} mit dem Encoding @param{encoding}.
   * Fehler werden mit Hilfe des @param{errorLogger} Callbacks für ein bestimmtes Topic @param{topic}
   * ausgeben.
   *
   * @static
   * @param errorLogger
   * @param path
   * @param topic
   * @returns - undefined bei Fehler
   */
  public static readTextFile(errorLogger: (message: string) => void, path: string, topic: string,
    encoding = 'utf8'): string {      

    if (!path) {
      errorLogger(`Pfad auf ${topic} in Konfigration nicht gesetzt.`);
    }

    let result;
    if (!FileSystem.fileExists(path)) {
      errorLogger(`${topic} unter ${path} ist nicht lesbar oder existiert nicht.`);
    } else {
      try {
        result = fs.readFileSync(path, encoding);
      } catch (err) {
        errorLogger(`${topic} unter ${path} kann nicht gelesen werden.`);
      }
    }

    return result;
  }

}