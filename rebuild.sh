#!/bin/sh

set -x

if [[ "$1" == "--clean" ]]; then
	gulp really-clean
fi

npm install         && \
gulp npm-install    && \
gulp
