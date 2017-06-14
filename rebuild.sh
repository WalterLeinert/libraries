#!/bin/sh

set -x

if [[ "$1" == "--clean" ]]; then
	gulp really-clean
fi

npm install         && \

for dir in core platform common server client components; do
  (
    cd $dir && npm install && gulp publish -f
  )
done