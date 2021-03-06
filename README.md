# Fluxgate libraries core, platform, common, client, server, testing

### Walter Leinert: 2016, 2017, 2018, 2019


## Überblick
Die Libraries stellen die Grundlage für die Implementierung von Projekten als Web-Anwendungen (single page apps, SPA) auf Basis von angular.io (aktuell: Version 6), express und knex dar.

### Core

Die Library enthält grundlegende Funktionalitäten für alle anderen Libraries zur Verfügung. Dazu gehören
  - Basisfunktionen (wie String-Utilities, Clone, Disposable)
  - Exception-Klassen
  - Assertions
  - Basisdatentypen (wie Color, Dictionary, Time, ShortTime, Tuple)
  - Publisher-Subscriber

### Platform

Die Library enthält (wenige) Funktionalitäten für die Plattformen Node (Server) und Browser (Client), die entweder auf beiden Plattformen unterschiedlich oder
nur auf einer Plattform verfügbar sind.

  - Logging (XLog, log4js)
  - einige Filesystem-Operationen
  - lesen von Json-Files

### Common

Die Library enthält Funktionalitäten, die in den Libraries server und client verwendet werden.

  - Support für anntotierte Modelklassen (decorators, Metadaten, Validierung)
  - Generierung von synthetischen Modelinstanzen (EntityGenerator)
  - Service-Interfaces
  - Basisklassen für User, Rollen und Mandanten im System
  - Redux/Command-Pattern (generische Basisklassen für die Kapselung von Servercalls im Client und zentrale Behandlung der Calls und die Notifizierung von registrierten Listenern)


### Server

Die Library kapselt die generische Implementierung von Rest-APIs auf Basis von Express und die Datenbankzugriffe mit Hilfe von Knex.
Dadurch ist es bei einer konkreten Anwendung sehr einfach, Rest-APIs für die entsprechenden Model-Klassen zu implementieren.

Unterstützt wird auch:
  - optimistic lock detection (über version column)
  - Mandantenfähigkeit (zusätzliche Spalte in Entities mit Mandanten-Id)

### Client

Die Library enthält Basisfunktionalität für Components sowie das konkrete Web-Projekt

  - Basisklassen für eigene GUI-Komponenten in Components
  - Direktiven
  - Support für reactive forms (model driven form builder) und mit automatischer Validierung aus den annotierten Modelklassen
  - Service-Klassen wie
    - ConfigService
    - MetadataService
    - MessageService
    - PrintService
    - generische Rest-API Service-Klasse

### Components

Die Library stellt Komponenten und Module zur Verfügung zur effizienten Implementierung von Web-Anwendungen auf Basis von angular.

  - Basisklassen für eigene GUI-Komponenten
  - Direktiven
  - Support für reactive forms (model driven form builder) und mit automatischer Validierung aus den annotierten Modelklassen
  - Standardkomponenten wie
    - Authentifizierung (flx-login, flx-logoff, flx-register, flx-change-password)
    - Passport-Service
    - Role- und User-Service
    - flx-autoform (modell gesteuerter automatischer Aufbau von Formularen)
    - flx-datatable-selector
    - flx-dropdown-selector
    - flx-enum-value
    - flx-month-selector
    - flx-year-selector
    - flx-time-selector
    - flx-user-selector
    - flx-role-selector

### Testing

Die Library enthält Hilfsklassen zur Implementierung von e2e-Tests.

- Basisklassen zur Implementierung von Komponenten- und PageObject-Helper
- Komponenten- und PageObject-Helper für Library-Komponenten (wie AutoformComponent, MonthSelectorComponent)

Mit Hilfe dieser Klassen lassen sich e2e-Tests effizienter und wartbarer implementieren.


## Dependency Injection

In @fluxgate/core ist ein dependency injection Mechanismus implementiert, der weitgehend kompatibel zum Mechanismus in angular ist.
Die eigentliche Funktionalität für dependency injection basiert auf der Library https://github.com/mgechev/injection-js. Die fehlende module und component Unterstützung ist
analog zu angular umgesetzt.

Hierzu sind zwei decorators @FlxComponent und @FlxModule implementiert, die in wesentlicher Hinsicht zu angular kompatibel sind.

Ein Beispiel für typischen DI-Code im Client-Teil eines konkreten Projekts sieht wie folgt aus (ClientComponent):

```ts
...
// -------------------------------------- logging --------------------------------------------
import { getLogger, levels, using, XLog } from '@fluxgate/platform';
// -------------------------------------- logging --------------------------------------------

import { EntityStringifyer } from '@fluxgate/common';
import {
  CoreInjector, DEFAULT_CATEGORY, FlxComponent, Injector, LOG_EXCEPTIONS,
  LOGGER, STRINGIFYER
} from '@fluxgate/core';


@FlxComponent({
  providers: [
    { provide: DEFAULT_CATEGORY, useValue: ClientComponent.logger.category },
    { provide: LOGGER, useValue: ClientComponent.logger },
    { provide: LOG_EXCEPTIONS, useValue: true },
    { provide: STRINGIFYER, useClass: EntityStringifyer }
  ]
})
export class ClientComponent {
  protected static readonly logger = getLogger(ClientComponent);

  constructor(injector: Injector) {
    using(new XLog(ClientComponent.logger, levels.INFO, 'ctor'), (log) => {
      CoreInjector.instance.setInjector(injector);
    });
  }
}
```

bzw. (ClientModule):

```ts
import { FlxModule } from '@fluxgate/core';

import { ClientComponent } from './client.component';

@FlxModule({
  imports: [
    ...
  ],
  declarations: [
    ClientComponent
  ],
  bootstrap: [
    ClientComponent
  ]
})
export class ClientModule {
}
```

Das Bootstrapping erfolgt analog zu Angular im Umfeld das Angular-Bootstraps z.B. in AppModule:

```ts
...
import { ClientModule } from './client.module';
...

@NgModule({
  imports: [
   ...
  ],
  ...
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(router: Router, private injector: Injector) {
    ModuleMetadataStorage.instance.bootstrapModule(ClientModule);
    ...
  }
}
```

Das Module ClientModule stellt die Wurzel der DI-Injection-Hierarchie für die Provider dar. Weitere projektspezifische DI-Modules (und Components) werden über entsprechende Imports in ClientModule konfiguriert.


## Entwicklung, Build

Die Softwareentwicklung erfolgt in Visual Studio Code (vscode).

Die Projektstruktur wurde auf lerna umgestellt, welches einen monorepo-Ansatz realisiert.

## Development

This guide explains how to set up your environment for @fluxgate/libraries development based on angular.io. It includes information about prerequisites, installing the required tools, creating an initial workspace and starter app, and running that app locally to verify your setup.

### Setting up the Local Environment and Workspace

#### Prerequisites

Before you begin, make sure your development environment includes tools like, Node.js®, npm package manager and docker.

##### Node.js® and an npm package manager.

Angular requires Node.js version 10.9.0 or later.

To check your version, run node -v in a terminal/console window.

To get Node.js, go to nodejs.org.

##### Docker

Get docker installed on your development platform.

##### Step 1: Install lerna

@fluxgate/libraries consists of multiple packages and is structured as a monorepo linke angular.io. [Lerna](https://github.com/lerna/lerna) is used to simplify management and build of this monorepo.

Lerna must be installed globally:

```bash
npm install --global lerna
```

(Currently version 2.11.0 is used)

##### Step 2: Clone the github repository

Clone the github repository to your local workspace ```<workspace>```

```bash
#
cd <workspace>
git clone https://github.com/WalterLeinert/libraries.git
cd libraries
```

##### Step 3: Clean your workspace

You may clean your workspace and remove all artifacts created by the build process.

```bash
# run clean
npm run clean

# or clean all (runs clean and removes the top level node_modules folder)
npm run reallyclean
```


##### Step 4: Start docker containers for (server) tests

```bash
# let lerna bootstrap and install all dependencies
docker-compose up -d
```

##### Step 5: Build all packages and run the tests

```bash
# let lerna bootstrap and install all dependencies
npm run bootstrap

# build all packages, run the tests. Packages will be built into the top level dist folder
npm run build:all
```

TODO: Build der Starter-Application


ALT

Abhängigkeiten zu @angular-Libraries und @fluxgate/libraries werden absolut angegeben, um Probleme durch automatische Updates bei
"npm install" zu vermeiden.
Also hat z.B. common eine Abhängigkeit zu core über: "@fluxgate/core": "2.2.7-beta.0" und nicht wie früher "@fluxgate/core": "\^2.2.7-beta.0".

Die internen Abhängigkeiten für alle fluxgate-Libraries zueinander können mit dem Skript bin/update-fluxgate-all.sh (in einer bash) aktualisert werden.
Dazu wird für jede Library die aktuelle Version aus package.json ermittelt und bei den betroffenen Libraries eingetragen.

Die Aktualisierung erfolgt im Rootverzeichnis (libraries): "bin/update-fluxgate-all.sh"

Ein kompletter Rebuild erfolgt mit dem Skript bin/rebuild.sh; über die Option --clean erfolgt vor dem Build ein really-clean (alle temporären
und die node_modules Verzeichnisse löschen). Das Skript legt bei jedem Lauf im Verzeichnis logs eine Logdatei an.

Der Rebuild erfolgt im Rootverzeichnis (libraries): "bin/rebuild.sh"

```bash
# rebuild (ohne really clean): nur sinnvoll, wenn alle package-Versionen erhöht wurden!
cd .../libraries
bin/rebuild.sh

# rebuild mit really clean: geht immer, räumt vorher komplett auf, dauert länger
bin/rebuild.sh --clean

```


### Release Notes

#### Version 2.5.0
  - Build-Konfiguration vereinfacht
    - zentrales tsconfig.json im Root-Verzeichnis
    - (fast alle) devDependencies in package.json im Root-Verzeichnis

#### Version 2.2.4

  - common
    - EntityVersionProxy: Clone der Entities für Ergebnisse aus dem Cache
    - redux: CurrentItem muss keine Entity mit Id sein

  - server
    - refactoring der Service/Controller-Struktur (neu: TableController, IServiceCore)

