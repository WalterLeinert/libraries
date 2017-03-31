# @fluxgate/common -- Support für Client/Server-Entwicklung

### Walter Leinert, Christian Lehmeier, Dez 2016

## Features

Utilites, die projektunabhängig sind und bei der Client- und Serverentwicklung verwendet werden können und sollen.
Die Libraries @fluxgate/client und @fluxgate/server basieren auf @fluxgate/common.

- TODO

(Details siehe unten).

## Installation

Die Installation in einem konkreten Projekt erfolgt über npm (und unseren verdaccio-Server).

```batch
$ npm install --save @fluxgate/common 
```

Das ist aber in Projekten nicht direkt erforderlich, die @fluxgate/client und/oder @fluxgate/server verwenden.


## Details

TODO

## Entwicklung

Für die Weiterentwicklung von @fluxgate/common ist nach dem Clone zunächst ein `npm install` erforderlich.

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
