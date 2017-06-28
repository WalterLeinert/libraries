#!/bin/bash

ts=$(date +"%Y-%m-%d-%H-%M-%S")

mkdir -p logs

{
	set -x

	if [[ "$1" == "--clean" ]]; then
    shift
		gulp really-clean
	fi

  if [[ "$1" == "--no-publish" ]]; then
    shift
		publish_cmd=""
  else
  	publish_cmd="publish -f"
	fi

	npm install

	for dir in core platform common server client components; do
	(
		cd $dir                     && \
		npm install                 && \
		gulp ${publish_cmd}
	)
	done
} > logs/build-${ts}.log 2>&1 &

tail -f logs/build-${ts}.log