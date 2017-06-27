#!/bin/bash

grep version */package.json | sed -e 's/^\([^/]*\)\/.*version\":[ \t]*\"\([^\"]*\)\".*/\1 \2/'