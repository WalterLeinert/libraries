#!/bin/bash

# set -x

dir=$1
shift

packageJson=$1
shift

deps=$@



function getVersion() {
	if (($# < 1)); then
		echo "missing package.json file"
		exit 1
	fi

	local package=$1
	grep version ${package} | sed -e 's/.*:[ ]*\"\([^\"]*\)\".*/\1/'
}

function updateFluxgate() {
	if (($# < 3)); then
		echo "too less parameters"
		exit 1
	fi


	lib="$1"
	shift

	version="$1"
	shift

	packages=$@

	for package in ${packages}; do
		file=${package}/package.json
		tempfile=${file}.tmp
		mv ${file} ${tempfile}

		sed -e "s/\(\"@fluxgate\/${lib}\":[ ]*\)\(\"[^\">]*\"\)/\1\"${version}\"/" ${tempfile} > ${file}

		dos2unix -q ${file}
		rm -f ${tempfile}
	done
}

updateFluxgate ${dir} $(getVersion ${packageJson}) ${deps}
