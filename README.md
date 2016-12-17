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
Nach Änderungen ist compiliert man mit `npm run tsc` bzw. `npm run prepublish` direkt vor einer Veröffentlichung auf unseren `verdaccio` npm-Proxy.
Das eigentliche Veröffentlichen erfolgt mit `npm publish``.

Wichtig dabei: vor dem Veröffentlichen die Package-Version erhöhen, da Verdaccio sonst einen Fehler liefert.

Nach dem Veröffentlichen einer neuen Version, müssen natürlich alle betroffenen Projekte aktualisiert werden:


## CHANGELOG

#### v1.2.0

TODO
