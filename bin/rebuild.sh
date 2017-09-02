#!/bin/bash


# Usage info
show_help() {
cat << EOF
Usage: ${0##*/} [-c] [-o] [-x]
Control the rebuild.

    -c          do a really clean before the rebuild
    -o          write the result to stdout instead of writing to an logfile.
    -x          remove all logfiles before rebuild
EOF
}


remove_logfiles=0
really_clean=0
write_logfile=1

while getopts "cox" opt; do
  case $opt in
    c)
      really_clean=1
      ;;
    o)
      write_logfile=0
      ;;
    x)
      remove_logfiles=1
      ;;
    *)
      show_help >&2
            exit 1
      ;;
  esac
done
shift "$((OPTIND-1))"   # Discard the options and sentinel --


if (($write_logfile)); then
  ts=$(date +"%Y-%m-%d-%H-%M-%S")
  logfile="logs/build-${ts}.log"
fi


function rebuild() {
  # set -x
  local really_clean=${1:-0}
  local remove_logfiles=${2:-0}
  local logfile=${3:-stdout}

  mkdir -p logs

  if (($remove_logfiles)); then
    echo "removing logfiles ..."
    rm -f $(ls -1 logs/build* | grep -v "${logfile}")
  fi

  echo "running rebuild, logging to ${logfile} ..."

	set -x

  if (($really_clean)); then
      echo "really clean ..."
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
}

if (($write_logfile)); then
  rebuild $really_clean $remove_logfiles ${logfile} > ${logfile} 2>&1
else
  rebuild $really_clean $remove_logfiles
fi