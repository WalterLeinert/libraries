export class JsonReader {

    public static readJson<T>(jsonPath: string, cb) {
        let fs = require('fs');
        let data = fs.readFile(jsonPath, (err, data) => {
            try {
                let config = <T>JSON.parse(data);
                cb(null, config);
            } catch (err) {
                console.error('Die Json-Konfiguration ${jsonPath} ist kein gültiges JSON-Format.')
                cb(err, null);
            }
        });
    }
}