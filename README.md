# @fluxgate/client -- Support für Client-Entwicklung

### Walter Leinert, Christian Lehmeier, Dez 2016

## Features

Alle Clientfeatures, die projektunabhängig sind:
- TODO

(Details siehe unten).

## Installation

Die Installation in einem konkreten Projekt erfolgt über npm (und unseren verdaccio-Server).

```batch
$ npm install --save @fluxgate/client 
```

TODO:

> **Important!** TsExpressDecorators requires Node >= 4, Express >= 4, TypeScript >= 2.0 and 
the `experimentalDecorators`, `emitDecoratorMetadata`, `types` and `lib` compilation 
options in your `tsconfig.json` file.

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es6", "dom"],
    "types": ["reflect-metadata"],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators":true,
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "declaration": false
  },
  "exclude": [
    "node_modules"
  ]
}
```

## Details

TODO

## Entwicklung

Für die Weiterentwicklung von @fluxgate/client ist nach dem Clone zunächst ein `npm install` erforderlich.

Wird zum Bauen oder Testen eine aktuelle Version von `@fluxgate/common` benötigt, so führt man folgendes Kommando aus:
```bash
$ gulp update-fluxgate
```
Nach den Code-Änderungen Änderungen compiliert man mit 
```bash
$ gulp
```

Das eigentliche Veröffentlichen erfolgt mittels:
```bash
$ npm publish
```

Wichtig dabei: vor dem Veröffentlichen die Package-Version erhöhen, da Verdaccio sonst einen Fehler liefert (z.B. 1.6.3 -> 1.6.4 oder 1.4.34 -> 1.5.0).
Muss man für eine die Libraryversion hintereinander verschiedene Fehler beheben, kann man testweise auch immer wieder mit derselben Versionsnummer publizieren:
```bash
# force: überschreibt existierendes Package!
$ npm publish -f
```

Nach dem Veröffentlichen einer neuen Version, müssen natürlich alle betroffenen Projekte aktualisiert werden:
```bash
$ gulp update-fluxgate
```

## CHANGELOG

#### v1.2.0

TODO
