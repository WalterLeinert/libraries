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
Nach Änderungen ist compiliert man mit `npm run tsc` bzw. `npm run prepublish` direkt vor einer Veröffentlichung auf unseren `verdaccio` npm-Proxy.
Das eigentliche Veröffentlichen erfolgt mit `npm publish``.

Wichtig dabei: vor dem Veröffentlichen die Package-Version erhöhen, da Verdaccio sonst einen Fehler liefert.

Nach dem Veröffentlichen einer neuen Version, müssen natürlich alle betroffenen Projekte aktualisiert werden:

```bash
TODO: wann muss man jetzt welches Kommando absetzen? abhängig von major/minor Versionsänderung?
$ npm update --save @fluxgate/client
$ npm install --save @fluxgate/client
```

## CHANGELOG

#### v1.2.0

TODO
