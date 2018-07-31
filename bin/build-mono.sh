#!/bin/sh

root_dir="$(dirname $0)/.."

# client built by ng (see below)
gulp_libs="core platform common node server testing"

(
	cd $root_dir

	echo "building project $(/bin/pwd)"

	echo "installing npm packages ..."
	npm i

	echo "bootstrap lerna and hoisting dependencies ..."
	lerna bootstrap --hoist --concurrency 1

	for lib in ${gulp_libs}; do
		echo "performing gulp compile/test for $lib ..."
		(cd packages/$lib && gulp test)
	done

	echo "building client ..."
	ng build client

	echo "building components ..."
	ng build components


  # -----------------------------------------------------------------

  echo "building starter project $(/bin/pwd)"

  gulp_starter="common server"

  for part in ${gulp_starter}; do
		echo "performing gulp compile/test for starter/$part ..."
		(
      cd applications/starter/$part \
      && npm i \
      && gulp test
    )
	done

  echo "building starter client ..."
	ng build starter
)
