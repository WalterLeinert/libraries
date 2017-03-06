import { Assert } from './assert';

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
      if (process.env.PLATFORM === 'node') {
        const fs = require('fs');
        fs.accessSync(path, fs.constants.R_OK);
        return true;
      } else {
        throw new Error('not supported');
      }
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
      if (process.env.PLATFORM === 'node') {
        const fs = require('fs');
        return fs.statSync(path).isDirectory();
      } else {
        throw new Error('not supported');
      }
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
   * @param {(message: string) => void} errorLogger
   * @param {string} path
   * @param {string} topic
   * @returns {string} - undefined bei Fehler
   * 
   * @memberOf FileSystem
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
        if (process.env.PLATFORM === 'node') {
          const fs = require('fs');
          result = fs.readFileSync(path, encoding);
        } else {
          throw new Error('not supported');
        }
      } catch (err) {
        errorLogger(`${topic} unter ${path} kann nicht gelesen werden.`);
      }
    }

    return result;
  }

}