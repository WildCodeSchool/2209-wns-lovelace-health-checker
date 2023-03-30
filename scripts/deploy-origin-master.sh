#!/bin/sh
git fetch origin && git reset --hard origin/master && git clean -f -d
./build-start.prod.sh