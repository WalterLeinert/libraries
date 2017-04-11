#!/bin/sh
gulp really-clean   && \
npm install         && \
gulp npm-install    && \
gulp