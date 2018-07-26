#!/bin/sh

root_dir="$(dirname $0)/.."


gulp_libs="core platform common node client server testing"

(
	cd $root_dir

	echo "building project $(/bin/pwd)"

	echo "installing npm packages ..."
	npm i

	echo "bootstrap lerna and hoisting dependencies ..."
	lerna boostrap --hoist --concurrency 1

	for lib in ${gulp_libs}; do
		echo "performing gulp compile/test for $lib"
		(cd packages/$lib && gulp test)
	done

	echo "building client"
	ng build client

	echo "building components"
	ng build components

	echo "building starter"
	ng build starter
)
