#!/bin/bash

(
	lib=core
	echo -n "updating dependencies for $lib..."

	cd ${lib} 		&& \
	../bin/update-fluxgate-deps.sh ${lib} package.json ../platform ../common ../server ../client ../components 

	echo "done"
)

(
	lib=platform
	echo -n "updating dependencies for $lib..."

	cd ${lib} 		&& \
	../bin/update-fluxgate-deps.sh ${lib} package.json ../common ../server ../client ../components 

	echo "done"
)

(
	lib=common
	echo -n "updating dependencies for $lib..."

	cd ${lib} 		&& \
	../bin/update-fluxgate-deps.sh ${lib} package.json ../server ../client ../components 

	echo "done"
)

(
	lib=client
	echo -n "updating dependencies for $lib..."

	cd ${lib} 		&& \
	../bin/update-fluxgate-deps.sh ${lib} package.json ../components 

	echo "done"
)

