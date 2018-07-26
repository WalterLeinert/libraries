#!/bin/sh

root_dir="$(dirname $0)/.."



gulp_libs="core platform common node client server testing"

(
	cd $root_dir

	echo "cleaning project $(/bin/pwd)"

	for lib in ${gulp_libs}; do
		echo "performing gulp clean for $lib"
		(cd packages/$lib && gulp clean)
	done

	lerna clean --yes

	rm -rf node_modules dist
)

