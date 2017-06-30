#!/bin/sh

verdaccio > log/verdaccio.log 2>&1 &

echo "started verdaccio ..."

sleep 5

npm adduser <<!
node
node
node@node.com
!


(
        mkdir master && cd master

        #
        echo "cloning fluxgate/libraries..."

        git clone http://server.fluxgate.de:90/fluxgate/libraries.git
)