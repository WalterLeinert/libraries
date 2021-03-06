# @fluxgate/server -- Support für Server-Entwicklung

### Walter Leinert, Christian Lehmeier, Dez 2016

## Features

Alle Serverfeatures, die projektunabhängig sind:
- Controller (für Login, Logoff, Register)
- generische Basisklasse für alle Controller

(Details siehe unten).

## Installation

Die Installation in einem konkreten Projekt erfolgt über npm (und unseren verdaccio-Server).

```batch
$ npm install --save @fluxgate/server 
```

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

Wir arbeiten mit der Library ts-express-decorators, mit der express-Webserver-Komponenten einfacher zu implmentieren sind.
Mit Hilfe von `decorators` kann man Komponenten annotieren (@Controller, @Service, etc.), die dann über das Framework 
automatisch eingebunden werden.

Controller implementieren Rest-APIs, mit den zugehörigen Basisfunktionen zum DB-Zugriff 
(`create, find, findById, update, delete`). Die Controller verwenden die generische Basisklasse `ControllerBase`,
womit sie ein typsicheres Arbeiten mit Entity/Modell-Klassen erlauben. 

Beispiel: 

```typescript
@Controller('/artikel')
export class ArtikelController extends ControllerBase<Artikel, number> {
    constructor(service: ArtikelService) {
        super(service, 'artikel', 'artikel_id');
    }
    ...
}
```
Neben der generischen Basisklasse `ControllerBase` findet man im Verzeichnis ts-express-decorators die Verzeichnisse
`controllers` und `services`, die folgende Komponenten enthalten:

- controllers
  - passportController: Controller für Login, Logoff, Register (von Benutzern)

- services
  - appRegistry.service: erlaubt den Zugriff auf den globale Datenbereich `AppRegistry`   
  - base.service: generische Basisklasse für den typsicheren Zugriff auf die Datenbank mittels `knex`
  - knex.service: Datenbankzugriff ist gekapselt über `knex` und für die bekannten Datenbanken konfigurierbar
  - metadata.service: Zugriff auf Metadaten zu Modellklassen für DB-Tabellen
  - passportLocal.service: Integration von passport.js für Authentifizierung der Benutzer
  - role.service: Zugriff auf Benutzerrollen
  - user.service: Zugriff auf Benutzer

## Entwicklung

Für die Weiterentwicklung von @fluxgate/server ist nach dem Clone zunächst ein `npm install` erforderlich.

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

#### v1.1.8

- passportController 