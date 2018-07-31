#!/bin/sh

root_dir="$(dirname $0)/.."



gulp_libs="core platform common node client server testing"

(
	cd $root_dir

	echo "cleaning project $(/bin/pwd)"

	for lib in ${gulp_libs}; do
		echo "performing gulp clean for $lib ..."
		(cd packages/$lib && gulp clean)
	done

	echo "cleaning lerna ..."
	lerna clean --yes


 # -----------------------------------------------------------------

  echo "cleaning starter project $(/bin/pwd)"

  gulp_starter="common server"

  for part in ${gulp_starter}; do
		echo "performing gulp clean for starter/$part ..."
		(cd applications/starter/$part && gulp clean)
	done


	echo "removing root node_modules/dist ..."
	rm -rf node_modules dist

)

