# Fluxgate libraries core, platform, common, client, components, server

### Walter Leinert April 2017


## Beschreibung

Die Libraries stellen die Basis für eine effiziente Implementierung von kundenspezifischen Projekten dar.
Möglichst die komplette nicht-projektspezifische Funktionalität sollte in den Libraries enthalten sein.

## Build

Der Build der Libraries ergolgt auf Basis von gulp.
Ein erster Build nach Clone des Repositories erfolgt mit folgenden Schritten:

```bash
npm install
gulp npm-install
gulp
gulp test
```

Das Publizieren auf den verdaccio-Server erfolgt mit:

```bash
gulp publish
```

Existiert bereits ein gebauter Stand, kann man mit folgenden Schritten einen kompletten Rebuild erzeugen:

```bash
gulp really-clean
npm install
gulp npm-install
gulp
gulp test
```

Ist eine cygwin-Bash installiert, kann man auch das Skript rebuild.sh hierfür verwenden:

```bash
./rebuild.sh
```


## Installation

Die Installation der Libraries in ein Anwendungsprojekt erfolgt über npm:

```bash
npm install --save @fluxgate{core,common,platform,client,components,server}
```

bzw. Updates später über gulp:
```bash
gulp update-fluxgate
```