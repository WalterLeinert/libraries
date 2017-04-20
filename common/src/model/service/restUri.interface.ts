/**
 * Interface für alle REST-Api-Implementierungen
 *
 */
export interface IRestUri {

  /**
   * Liefert das Topic des REST-Api (z.B. 'passport' oder 'artikel')
   *
   * @type {string}
   */
  getTopic(): string;

  /**
   * Liefert den Topicpfad (z.B. '/artikel' bei Topic 'artikel').
   *
   * @type {string}
   */
  getTopicPath(): string;

  /**
   * Liefert die resultierende Url (baseUrl + topic, z.B. http://localhost;8000/rest/artikel)
   *
   * @type {string}
   */
  getUrl(): string;
}