#!/bin/bash

ts=$(date +"%Y-%m-%d-%H-%M-%S")

{
	set -x


	if [[ "$1" == "--clean" ]]; then
		gulp really-clean
	fi

	npm install

	for dir in core platform common server client components; do
	(
		cd $dir                     && \
		npm install                 && \
		gulp publish -f
	)
	done
} >build-${ts}.log 2>&1
