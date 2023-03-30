#!/bin/sh
git clean -f -d && git reset --hard HEAD && git checkout master && git pull
./build-start.prod.sh