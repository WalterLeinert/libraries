import * as CryptoJS from 'crypto-js';


export class Encryption {
  private static KEY_SIZE = 128;
  private static KEY_SIZE_DIVISOR = 32;
  private static SALT_LEN = 64;
  private static ITERATIONS = 1000;
  private static DIGEST = 'sha256';



  public static hashPassword(password: string, salt: string, callback?) {
    const len = Encryption.KEY_SIZE / this.KEY_SIZE_DIVISOR;

    const encryptionOptions = { keySize: len, iterations: Encryption.ITERATIONS };

    if (2 === arguments.length) {
      callback = salt;
      salt = CryptoJS.lib.WordArray.random(Encryption.SALT_LEN);
    }

    const output = CryptoJS.PBKDF2(password, salt, encryptionOptions);
    callback(null, output.toString(CryptoJS.enc.Hex));
  }
}