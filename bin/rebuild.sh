#!/bin/bash


# Usage info
show_help() {
cat << EOF
Usage: ${0##*/} [-c] [-o]
Control the rebuild.

    -c          do a really clean before the rebuild
    -o          write the result to stdout instead of writing to an logfile.
EOF
}

really_clean=0
write_logfile=1

while getopts "co" opt; do
  case $opt in
    c)
      really_clean=1
      ;;
    o)
      write_logfile=0
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

  mkdir -p logs
  logfile="logs/build-${ts}.log"

  log_redirection="tee logs/build-${ts}.log 2>&1"
else
  logfile="-stdout-"
  log_redirection="tee"
fi


echo "running rebuild, logging to ${logfile}"

{
	set -x


  if (($really_clean)); then
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
} | ${log_redirection}

# tail -f logs/build-${ts}.log