# Fluxgate libraries core, platform, common, client, server

### Walter Leinert: 2016, 2017


## Überblick
Die Libraries stellen die Grundlage für die Implementierung von Projekten als Web-Anwendungen auf Basis von angular.io (angular 2), express und knex dar.

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