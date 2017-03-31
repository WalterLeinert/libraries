import crypto = require('crypto');

export class Encryption {
    private static LEN = 256;
    private static SALT_LEN = 64;
    private static ITERATIONS = 10000;
    private static DIGEST = 'sha256';

    public static hashPassword(password: string, salt: string, callback?) {
        const len = Encryption.LEN / 2;

        if (3 === arguments.length) {
            crypto.pbkdf2(password, salt, Encryption.ITERATIONS, len, Encryption.DIGEST, (err, derivedKey) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, derivedKey.toString('hex'));
            });
        } else {
            callback = salt;
            crypto.randomBytes(Encryption.SALT_LEN / 2, (err, slt) => {
                if (err) {
                    return callback(err);
                }

                const sltString = slt.toString('hex');
                crypto.pbkdf2(password, sltString, Encryption.ITERATIONS, len, Encryption.DIGEST,
                    (cryptErr, derivedKey) => {
                        if (cryptErr) {
                            return callback(cryptErr);
                        }

                        callback(null, derivedKey.toString('hex'), sltString);
                    });
            });
        }
    }
}