const crypto = require('crypto');

export class Encryption {
    private static LEN = 256;
    private static SALT_LEN = 64;
    private static ITERATIONS = 10000;
    private static DIGEST = 'sha256';

    public static hashPassword(password: string, salt: string, callback?) {
        let len = Encryption.LEN / 2;

        if (3 === arguments.length) {
            crypto.pbkdf2(password, salt, Encryption.ITERATIONS, len, Encryption.DIGEST, function (err, derivedKey) {
                if (err) {
                    return callback(err);
                }

                return callback(null, derivedKey.toString('hex'));
            });
        } else {
            callback = salt;
            crypto.randomBytes(Encryption.SALT_LEN / 2, function (err, slt) {
                if (err) {
                    return callback(err);
                }

                slt = slt.toString('hex');
                crypto.pbkdf2(password, slt, Encryption.ITERATIONS, len, Encryption.DIGEST, function (cryptErr, derivedKey) {
                    if (cryptErr) {
                        return callback(cryptErr);
                    }

                    callback(null, derivedKey.toString('hex'), slt);
                });
            });
        }
    }
}